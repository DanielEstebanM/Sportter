import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  mensajeService,
  setupWebSocket,
  sendMessageWebSocket,
  setupWebSocketMultiple,
} from "../services/api";

function PantallaMensajes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mensajes");
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [webSocketReady, setWebSocketReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userDataMessages"));
  const currentUserId = userData?.id;
  const userId = userData?.id;
  const userEmail = userData?.correoElectronico;
  const userName = userData?.nombreUsuario;

  // Colores con tema anaranjado-rojizo
  const primaryColor = "#FF4500";
  const accentColor = "#FF7043";
  const backgroundColor = "#121212";
  const cardColor = "#1e1e1e";
  const textColor = "#e1e1e1";
  const lightTextColor = "#a0a0a0";
  const borderColor = "#2d2d2d";

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser?.messages]); // Se ejecuta cuando cambian los mensajes

  // También cuando se selecciona una conversación
  useEffect(() => {
    if (selectedUser) {
      scrollToBottom();
    }
  }, [selectedUser]);

  const stompClientRef = useRef(null);

  // Cargar todos los usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await mensajeService.buscarUsuarios("");

        // Ordenar usuarios alfabéticamente excluyendo al usuario actual
        const sortedUsers = response.data
          .filter((user) => user.id !== userId) // Excluir al usuario actual
          .sort((a, b) => {
            const nameA = a.nombreUsuario?.toUpperCase() || "";
            const nameB = b.nombreUsuario?.toUpperCase() || "";
            return nameA.localeCompare(nameB);
          });

        setUsers(sortedUsers);
        setAvailableUsers(sortedUsers); // Mostrar todos los usuarios inicialmente
      } catch (error) {
        console.error("Error loading users:", error);
        setUsers([]);
        setAvailableUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, [userId]);

  // Filtrar usuarios localmente según la búsqueda
  useEffect(() => {
    if (userSearchQuery.trim().length > 0) {
      const filtered = users.filter(
        (user) =>
          user.nombreUsuario
            ?.toLowerCase()
            .includes(userSearchQuery.toLowerCase()) ||
          user.correoElectronico
            ?.toLowerCase()
            .includes(userSearchQuery.toLowerCase())
      );
      setAvailableUsers(filtered);
    } else {
      setAvailableUsers(users); // Mostrar todos los usuarios cuando no hay búsqueda
    }
  }, [userSearchQuery, users]);

  // Detectar si es móvil o tablet
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowLeftSidebar(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar conversaciones al montar el componente
  useEffect(() => {
    if (userId) {
      cargarConversaciones();
    }
  }, [userId]);

  // Cargar conversaciones del usuario
  const cargarConversaciones = async () => {
    setLoading(true);
    try {
      const conversacionesRes =
        await mensajeService.obtenerConversacionesUsuario(userId);
      const conversaciones = conversacionesRes.data;

      const usuariosUnicos = new Map();

      await Promise.all(
        conversaciones
          .flatMap((conv) => [conv.usuario1Id, conv.usuario2Id])
          .filter((id) => id !== userId)
          .map(async (id) => {
            if (!usuariosUnicos.has(id)) {
              try {
                const usuarioRes = await mensajeService.obtenerUsuario(id);
                usuariosUnicos.set(id, usuarioRes.data);
              } catch (error) {
                console.error(`Error al cargar usuario ${id}:`, error);
                usuariosUnicos.set(id, {
                  id,
                  nombre: `Contacto ${id}`,
                  username: `user${id}`,
                });
              }
            }
          })
      );

      const conversacionesTransformadas = conversaciones.map((conv) => {
        const esUsuario1 = conv.usuario1Id === userId;
        const otroUsuarioId = esUsuario1 ? conv.usuario2Id : conv.usuario1Id;
        const otroUsuario = usuariosUnicos.get(otroUsuarioId) || {
          nombre: `Contacto ${otroUsuarioId}`,
          username: `user${otroUsuarioId}`,
        };

        conversaciones.sort((a, b) => {
          const fechaA = new Date(a.ultimoMensajeFecha || a.fechaCreacion);
          const fechaB = new Date(b.ultimoMensajeFecha || b.fechaCreacion);
          return fechaB - fechaA; // Orden descendente
        });

        return {
          id: conv.id,
          user: otroUsuario.nombre,
          username: otroUsuario.username,
          email: otroUsuario.email,
          destinatarioId: otroUsuarioId,
          avatar: "",
          lastMessage: "Cargando mensajes...",
          time: "Justo ahora",
          unread: false,
          messages: [],
        };
      });

      setConversations(conversacionesTransformadas);

      for (const conv of conversacionesTransformadas) {
        try {
          const mensajesResponse =
            await mensajeService.obtenerMensajesConversacion(conv.id);
          if (mensajesResponse.data?.length > 0) {
            const ultimoMensaje =
              mensajesResponse.data[mensajesResponse.data.length - 1];
            actualizarConversacion(conv.id, {
              lastMessage: ultimoMensaje.contenido,
              time: formatearFecha(ultimoMensaje.fechaHora),
              messages: mensajesResponse.data.map((m) => ({
                id: m.id,
                content: m.contenido,
                time: formatearFecha(m.fechaHora),
                sender:
                  m.remitenteId === userId
                    ? userName
                    : usuariosUnicos.get(m.remitenteId)?.nombre ||
                    `Usuario ${m.remitenteId}`,
                isUser: m.remitenteId === userId,
              })),
            });
          }
        } catch (error) {
          console.error(
            `Error al cargar mensajes para conversación ${conv.id}:`,
            error
          );
        }
        setWebSocketReady(true);
      }
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Actualizar una conversación específica
  const actualizarConversacion = (conversacionId, nuevosDatos) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversacionId ? { ...conv, ...nuevosDatos } : conv
      )
    );
  };

  // Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !userId) return;

    const tempId = Date.now();
    const mensajeDTO = {
      contenido: newMessage,
      remitenteId: userId,
      destinatarioId: selectedUser.destinatarioId,
      conversacionId: selectedUser.id,
    };

    // Mensaje optimista
    const mensajeOptimista = {
      id: tempId,
      content: newMessage,
      time: "Justo ahora",
      sender: userName,
      isUser: true,
    };

    // Actualización optimista
    setSelectedUser((prev) => ({
      ...prev,
      messages: [...prev.messages, mensajeOptimista],
      lastMessage: newMessage,
      time: "Justo ahora",
    }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedUser.id
          ? {
            ...conv,
            lastMessage: newMessage,
            time: "Justo ahora",
            messages: [...conv.messages, mensajeOptimista],
          }
          : conv
      )
    );

    setNewMessage("");

    try {
      // Enviar por WebSocket
      if (stompClientRef.current?.connected) {
        if (newMessage.metadata) {
          const parsedMetadata = JSON.parse(newMessage.metadata);
          if (parsedMetadata.type === "shared_post") {
            setSelectedUser((prev) => ({
              ...prev,
              messages: [...prev.messages, newMessage],
            }));
            return;
          }
        }
        sendMessageWebSocket(
          stompClientRef.current,
          selectedUser.id,
          mensajeDTO
        );
      }

      // Enviar por HTTP
      const response = await mensajeService.enviarMensaje(mensajeDTO);
      const mensajeReal = response.data;

      // Actualizar con ID real
      setSelectedUser((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === tempId
            ? {
              ...msg,
              id: mensajeReal.id,
              time: formatearFecha(mensajeReal.fechaHora),
            }
            : msg
        ),
      }));

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedUser.id
            ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === tempId
                  ? {
                    ...msg,
                    id: mensajeReal.id,
                    time: formatearFecha(mensajeReal.fechaHora),
                  }
                  : msg
              ),
            }
            : conv
        )
      );
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
      // Revertir en caso de error
      setSelectedUser((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== tempId),
      }));
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedUser.id
            ? {
              ...conv,
              messages: conv.messages.filter((msg) => msg.id !== tempId),
            }
            : conv
        )
      );
    }
  };

  // Configurar WebSocket
  useEffect(() => {
    if (!conversations.length) return;

    const ids = conversations.map((c) => c.id);
    const client = setupWebSocketMultiple(
      ids,
      (message) => {
        const isFromMe = message.remitenteId === userId;
        const isCurrentConversation =
          selectedUser?.id === message.conversacionId;

        // Actualizar lista de conversaciones
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== message.conversacionId) return conv;

            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: message.id,
                  content: message.contenido,
                  time: formatearFecha(message.fechaHora),
                  sender: isFromMe ? userName : conv.user,
                  isUser: isFromMe,
                },
              ],
              lastMessage: message.contenido,
              time: "Justo ahora",
              unread: !isCurrentConversation && !isFromMe,
            };
          })
        );

        // Actualizar conversación seleccionada si es la activa
        if (isCurrentConversation) {
          setSelectedUser((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: message.id,
                content: message.contenido,
                time: formatearFecha(message.fechaHora),
                sender: isFromMe ? userName : prev.user,
                isUser: isFromMe,
              },
            ],
            lastMessage: message.contenido,
            time: "Justo ahora",
            unread: false,
          }));
        }
      },
      (error) => {
        console.error("Error WebSocket:", error);
      }
    );

    stompClientRef.current = client;

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [conversations, userId, selectedUser]);

  // Verificar conexión WebSocket
  useEffect(() => {
    if (!stompClientRef.current) return;

    const interval = setInterval(() => {
      if (!stompClientRef.current?.connected) {
        setWebSocketReady(false);
        setTimeout(() => setWebSocketReady(true), 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [stompClientRef.current]);

  // Al seleccionar una conversación
  const handleSelectConversation = (conversation) => {
    const updatedConv =
      conversations.find((c) => c.id === conversation.id) || conversation;
    setSelectedUser(updatedConv);

    // Marcar como leído
    if (updatedConv.unread) {
      mensajeService
        .marcarMensajesLeidos(updatedConv.id, userId)
        .then(() => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === updatedConv.id ? { ...c, unread: false } : c
            )
          );
        })
        .catch(console.error);
    }
  };

  // Marcar mensajes como leídos
  useEffect(() => {
    if (selectedUser?.id && userId) {
      mensajeService
        .marcarMensajesLeidos(selectedUser.id, userId)
        .then(() => {
          actualizarConversacion(selectedUser.id, { unread: false });
        })
        .catch((error) => {
          console.error("Error al marcar mensajes como leídos:", error);
        });
    }
  }, [selectedUser, userId]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/", { replace: true });
  };

  // Filtrar usuarios disponibles (excluyendo los que ya están en conversaciones)
      const filteredAvailableUsers = availableUsers.filter(
        (user) => !conversations.some((conv) => conv.id === user.id)
      );

  const addNewConversation = async (user) => {
    try {
      // Primero crea la conversación en el backend
      const response = await mensajeService.crearConversacion(userId, user.id);
      const newConversation = {
        id: response.data.id,
        user: user.nombreUsuario,
        username: user.nombreUsuario,
        email: user.correoElectronico,
        destinatarioId: user.id,
        avatar: "",
        lastMessage: "",
        time: "Ahora",
        unread: false,
        messages: [],
      };

      setConversations([newConversation, ...conversations]);
      setSelectedUser(newConversation);
      setShowAddUserPopup(false);
      setUserSearchQuery("");
    } catch (error) {
      console.error("Error al crear nueva conversación:", error);
    }
  }

  const SharedPostCard = ({ metadata, onClick }) => {
    const data = JSON.parse(metadata);

    return (
      <div
        style={{
          border: "1px solid #FF4500",
          borderRadius: "8px",
          padding: "10px",
          margin: "10px 0",
          cursor: "pointer",
          backgroundColor: "#1e1e1e",
        }}
        onClick={onClick}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#FF4500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {data.author.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: "bold" }}>{data.author}</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <p style={{ margin: 0 }}>📢 Publicación compartida:</p>
          <p
            style={{
              margin: "5px 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            "{data.preview}"
          </p>
        </div>
        <div
          style={{
            color: "#FF7043",
            fontSize: "0.8rem",
            textAlign: "right",
          }}
        >
          Haz clic para ver completa
        </div>
      </div>
    );
  };

  // Filtrar conversaciones según búsqueda
  const filteredConversations = searchQuery
    ? conversations.filter(
        (conv) =>
          (conv.user || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (conv.username || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: backgroundColor,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: textColor,
        display: "flex",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Barra lateral izquierda */}
      <motion.div
        initial={{ x: isMobile ? -250 : 0 }}
        animate={{ x: showLeftSidebar ? 0 : isMobile ? -250 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          width: "250px",
          height: "100vh",
          borderRight: `1px solid ${borderColor}`,
          backgroundColor: cardColor,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            backgroundColor: primaryColor,
            padding: "10px",
          }}
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
        >
          <img
            src="https://i.imgur.com/vVkxceM.png"
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "invert()",
            }}
          />
        </motion.div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              color: activeTab === "inicio" ? accentColor : textColor,
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem",
            }}
            onClick={() => {
              setActiveTab("inicio");
              isMobile && setShowLeftSidebar(false);

              // Efecto de transición idéntico al de PantallaPrincipal
              document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
              setTimeout(() => {
                navigate("/principal", {
                  state: { user: userData },
                  replace: false,
                });
                document.body.style.overflow = ""; // Restaura el scroll
              }, 300);
            }}
          >
            <motion.div
              initial={false}
              animate={{
                rotate: activeTab === "inicio" ? 10 : 0, // Mismo efecto de inclinación de 10 grados
                scale: activeTab === "inicio" ? 1.1 : 1, // Mismo escalado del 10%
              }}
              transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
              style={{ marginBottom: "0.10rem" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.75rem" }}
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  d="M2 11.5h2a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V6.5h.389a.496.496 0 0 0 .413-.838L6.422.681a.59.59 0 0 0-.844 0L.698 5.662a.496.496 0 0 0 .413.838H1.5V11a.5.5 0 0 0 .5.5z"
                ></path>
              </svg>
            </motion.div>
            Inicio
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              color: activeTab === "explorar" ? accentColor : textColor,
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem",
            }}
            onClick={() => {
              setActiveTab("explorar");
              isMobile && setShowLeftSidebar(false);

              // Efecto de transición
              document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
              setTimeout(() => {
                navigate("/equipos", {
                  state: { user: userEmail },
                  replace: false,
                });
                document.body.style.overflow = ""; // Restaura el scroll
              }, 300);
            }}
          >
            <motion.div
              initial={false}
              animate={{
                rotate: activeTab === "explorar" ? 10 : 0, // Mismo efecto de inclinación de 10 grados
                scale: activeTab === "explorar" ? 1.1 : 1, // Mismo escalado del 10%
              }}
              transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
              style={{ marginBottom: "0.20rem" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.75rem" }}
              >
                <path
                  fill="currentColor"
                  d="M14.754 10c.966 0 1.75.784 1.75 1.75v4.749a4.501 4.501 0 0 1-9.002 0V11.75c0-.966.783-1.75 1.75-1.75zm0 1.5H9.252a.25.25 0 0 0-.25.25v4.749a3.001 3.001 0 0 0 6.002 0V11.75a.25.25 0 0 0-.25-.25M3.75 10h3.381a2.74 2.74 0 0 0-.618 1.5H3.75a.25.25 0 0 0-.25.25v3.249a2.5 2.5 0 0 0 3.082 2.433c.085.504.24.985.453 1.432Q6.539 18.999 6 19a4 4 0 0 1-4-4.001V11.75c0-.966.784-1.75 1.75-1.75m13.125 0h3.375c.966 0 1.75.784 1.75 1.75V15a4 4 0 0 1-5.03 3.866c.214-.448.369-.929.455-1.433q.277.066.575.067a2.5 2.5 0 0 0 2.5-2.5v-3.25a.25.25 0 0 0-.25-.25h-2.757a2.74 2.74 0 0 0-.618-1.5M12 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6m6.5 1a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m6.5.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m6.5 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-13 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2"
                ></path>
              </svg>
            </motion.div>
            Equipos
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              color: activeTab === "eventos" ? accentColor : textColor,
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem",
            }}
            onClick={() => {
              setActiveTab("eventos");
              isMobile && setShowLeftSidebar(false);

              // Efecto de transición idéntico al de PantallaPrincipal
              document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
              setTimeout(() => {
                navigate("/eventos", {
                  state: { user: userData },
                  replace: false,
                });
                document.body.style.overflow = ""; // Restaura el scroll
              }, 300);
            }}
          >
            <motion.div
              initial={false}
              animate={{
                rotate: activeTab === "eventos" ? 10 : 0, // Mismo efecto de inclinación de 10 grados
                scale: activeTab === "eventos" ? 1.1 : 1, // Mismo escalado del 10%
              }}
              transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
              style={{ marginBottom: "0.20rem" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.75rem" }}
              >
                <path
                  d="M16 10H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1m3-7h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-1 16H6c-.55 0-1-.45-1-1V8h14v10c0 .55-.45 1-1 1m-5-5H8c-.55 0-1 .45-1 1s.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1"
                  fill={activeTab === "eventos" ? accentColor : textColor}
                />
              </svg>
            </motion.div>
            Eventos
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              color: activeTab === "mensajes" ? accentColor : textColor,
              backgroundColor: "rgba(255, 112, 67, 0.1)",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
            onClick={() => {
              setActiveTab("mensajes");
              isMobile && setShowLeftSidebar(false);

              // Efecto de transición
              document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
              setTimeout(() => {
                navigate("/mensajes", {
                  state: { user: userEmail },
                  replace: false,
                });
                document.body.style.overflow = ""; // Restaura el scroll
              }, 300);
            }}
          >
            <motion.div style={{ marginRight: "0.75rem" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm-8-7H7m10 4H7"
                ></path>
              </svg>
            </motion.div>
            Mensajes
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              color: activeTab === "perfil" ? accentColor : textColor,
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem",
            }}
            onClick={() => {
              setActiveTab("perfil");
              isMobile && setShowLeftSidebar(false);

              document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
              setTimeout(() => {
                navigate(`/perfil/${currentUserId}`, {
                  state: { user: userData },
                  replace: false,
                });
                document.body.style.overflow = ""; // Restaura el scroll
              }, 300);
            }}
          >
            <motion.div
              initial={false}
              animate={{
                rotate: activeTab === "perfil" ? 10 : 0, // Mismo efecto de inclinación de 10 grados
                scale: activeTab === "perfil" ? 1.1 : 1, // Mismo escalado del 10%
              }}
              transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
              style={{ marginBottom: "0.20rem" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.75rem" }}
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M18 20a6 6 0 0 0-12 0"></path>
                  <circle cx="12" cy="10" r="4"></circle>
                  <circle cx="12" cy="12" r="10"></circle>
                </g>
              </svg>
            </motion.div>
            Perfil
          </motion.button>
        </div>

        <div
          style={{
            marginTop: "auto",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
            borderRadius: "50px",
            cursor: "pointer",
            ":hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          {/* IMAGEN DE USUARIO ABAJO IZQUIERDA */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: !userData?.imagen_perfil ? primaryColor : "transparent",
              overflow: "hidden",
              marginRight: "0.75rem",
              flexShrink: 0,
              border: userData?.imagen_perfil ? `1px solid rgb(122, 122, 122)` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userData?.imagen_perfil ? (
              <img
                src={
                  userData.imagen_perfil.startsWith("data:image")
                    ? userData.imagen_perfil
                    : `http://localhost:8080/${userData.imagen_perfil}`
                }
                alt={`Avatar de ${userData.nombreUsuario}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  console.error("Error cargando imagen de perfil:", e);
                  e.target.style.display = "none";
                  e.target.parentNode.style.backgroundColor = primaryColor;
                }}
              />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ margin: "12px" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z"
                  fill="white"
                />
                <path
                  d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                  fill="white"
                />
                <path
                  d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z"
                  fill="white"
                />
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
              {userName?.charAt(0).toUpperCase() + userName?.slice(1)}
            </div>
            <div
              data-tooltip-id="tooltip-email"
              data-tooltip-content={userEmail}
              style={{
                maxWidth: "100px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {userEmail}
            </div>
            <ReactTooltip
              id="tooltip-email"
              place="bottom"
              style={{ backgroundColor: "rgba(204, 112, 0, 0.27)" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: "transparent",
              border: "none",
              color: textColor,
              cursor: "pointer",
              padding: "0.5rem",
            }}
            onClick={handleLogout}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3m8 0h9m-12-8v.01m3-7.448v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"
                fill="none"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: isMobile ? "0" : "250px",
          backgroundColor: backgroundColor,
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Lista de conversaciones */}
        <div
          style={{
            width: isMobile ? (selectedUser ? "0" : "100%") : "350px",
            borderRight: `1px solid ${borderColor}`,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s ease",
          }}
        >
          {/* Encabezado */}
          <div
            style={{
              padding: "1rem",
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: cardColor,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.5rem",
              }}
            >
              <h2
                style={{
                  fontWeight: "bold",
                  margin: 0,
                  fontSize: "1.5rem",
                  color: primaryColor,
                  width: "100%",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                Mensajes
              </h2>

              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddUserPopup(true)}
                  style={{
                    background: primaryColor,
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginLeft: "0.5rem",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                      fill="white"
                    />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Botón de nueva conversación en móvil */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddUserPopup(true)}
                style={{
                  width: "100%",
                  background: primaryColor,
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "0.75rem",
                  fontSize: "0.9rem",
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "0.5rem" }}
                >
                  <path
                    d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                    fill="white"
                  />
                </svg>
                Nueva conversación
              </motion.button>
            )}

            {/* Buscador */}
            <div
              style={{
                position: "relative",
                marginTop: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Buscar Mensajes Directos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "50px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: backgroundColor,
                  color: textColor,
                  outline: "none",
                  fontSize: "0.9rem",
                }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: lightTextColor,
                }}
              >
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Lista de chats */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: `${lightTextColor} ${cardColor}`,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: cardColor,
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: lightTextColor,
                borderRadius: "10px",
                border: `2px solid ${cardColor}`,
              },
            }}
          >
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                style={{
                  padding: "1rem",
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor:
                    selectedUser?.id === conversation.id
                      ? "rgba(255, 69, 0, 0.1)"
                      : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: primaryColor,
                    marginRight: "0.75rem",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: conversation.remitenteImagenPerfil ? "1px solid rgb(122, 122, 122)" : "none"
                  }}
                >
                  {conversation.remitenteImagenPerfil ? (
                    <img
                      src={conversation.remitenteImagenPerfil}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z"
                        fill="white"
                      />
                      <path
                        d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                        fill="white"
                      />
                      <path
                        d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {conversation.user}
                    </span>
                    <span style={{ color: lightTextColor, fontSize: "0.8rem" }}>
                      {conversation.time}
                    </span>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span
                      style={{
                        color: conversation.unread ? textColor : lightTextColor,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      @{conversation.username} - {conversation.lastMessage}
                    </span>
                    {conversation.unread && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: primaryColor,
                          marginLeft: "0.5rem",
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Área de mensajes */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: isMobile ? "none" : `1px solid ${borderColor}`,
            width: isMobile && !selectedUser ? "0" : "auto",
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          {selectedUser ? (
            <>
              {/* Encabezado del chat */}
              <div
                style={{
                  padding: "1rem",
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor: cardColor,
                  display: "flex",
                  alignItems: "center",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                {isMobile && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: textColor,
                      cursor: "pointer",
                      padding: "0.5rem",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => setSelectedUser(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1.5em"
                      height="1.5em"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h7"
                      ></path>
                    </svg>
                  </motion.button>
                )}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: primaryColor,
                    marginRight: "0.75rem",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z"
                      fill="white"
                    />
                    <path
                      d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                      fill="white"
                    />
                    <path
                      d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{selectedUser.user}</div>
                  <div style={{ color: lightTextColor, fontSize: "0.8rem" }}>
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div
                ref={messagesEndRef}
                style={{
                  flex: 1,
                  backgroundImage: `url('/src/assets/fondoMensajes.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "1rem",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${lightTextColor} ${cardColor}`,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: cardColor,
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: lightTextColor,
                    borderRadius: "10px",
                    border: `2px solid ${cardColor}`,
                  },
                }}
              >
                {selectedUser.messages.length > 0 ? (
                  selectedUser.messages.map((message) => {
                    try {
                      if (message.metadata) {
                        const metadata = JSON.parse(message.metadata);
                        if (metadata.type === "shared_post") {
                          // Si tiene metadata válido, muestra el SharedPostCard
                          return (
                            <div key={message.id} style={{ margin: "10px 0" }}>
                              <SharedPostCard
                                metadata={message.metadata}
                                onClick={() =>
                                  navigate(`/publicaciones/${metadata.postId}`)
                                }
                              />
                            </div>
                          );
                        }
                      } else {
                        // Mensaje normal de texto
                        return (
                          <div
                            key={message.id}
                            style={{
                              marginBottom: "1.5rem",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: message.isUser
                                ? "flex-end"
                                : "flex-start",
                            }}
                          >
                            {message.sender !==
                              selectedUser.messages[0]?.sender && (
                              <div
                                style={{
                                  color: lightTextColor,
                                  fontSize: "0.8rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {/* {message.isUser ? userName : message.sender} ·{" "} */}
                                {/* {message.time} */}
                              </div>
                            )}
                            <div
                              style={{
                                backgroundColor: message.isUser
                                  ? primaryColor
                                  : cardColor,
                                color: message.isUser ? "white" : textColor,
                                padding: "0.75rem 1rem",
                                borderRadius: message.isUser
                                  ? "18px 18px 4px 18px"
                                  : "18px 18px 18px 4px",
                                maxWidth: "70%",
                                wordBreak: "break-word",
                                border: message.isUser
                                  ? "none"
                                  : `1px solid ${borderColor}`,
                              }}
                            >
                              {message.content}
                            </div>
                            <div
                              style={{
                                color: lightTextColor,
                                fontSize: "0.7rem",
                                marginTop: "0.25rem",
                                alignSelf: message.isUser
                                  ? "flex-end"
                                  : "flex-start",
                              }}
                            >
                              {message.time}
                            </div>
                            <div ref={messagesEndRef} />{" "}
                            {/* Este div marca el final */}
                          </div>
                        );
                      }
                    } catch (error) {
                      console.error("Error al procesar mensaje:", error);
                      return null;
                    }
                  })
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color: lightTextColor,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                      No hay mensajes aún
                    </div>
                    <div>Envía un mensaje para comenzar la conversación</div>
                  </div>
                )}
              </div>

              {/* Enviar mensaje */}
              <div
                style={{
                  padding: "1rem",
                  borderTop: `1px solid ${borderColor}`,
                  backgroundColor: cardColor,
                  position: "sticky",
                  bottom: 0,
                }}
              >
                <form onSubmit={handleSendMessage}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Escribe un mensaje"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        borderRadius: "50px",
                        border: `1px solid ${borderColor}`,
                        backgroundColor: backgroundColor,
                        color: textColor,
                        outline: "none",
                        fontSize: "0.9rem",
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      style={{
                        background: primaryColor,
                        color: "white",
                        borderRadius: "50%",
                        border: "none",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                      }}
                      disabled={!newMessage.trim()}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                          fill="white"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: `rgba(255, 69, 0, 0.1)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                    fill={primaryColor}
                  />
                </svg>
              </div>
              <h2
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                Selecciona un mensaje
              </h2>
              <p
                style={{
                  color: lightTextColor,
                  marginBottom: "1.5rem",
                }}
              >
                Elige entre tus mensajes existentes o inicia uno nuevo.
              </p>
              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAddUserPopup(true)}
                  style={{
                    background: primaryColor,
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.5rem", marginBottom: "0.2rem" }}
                  >
                    <path
                      d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                      fill="white"
                    />
                  </svg>
                  Nueva conversación
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botón para mostrar barra izquierda en móviles */}
      {isMobile && !showLeftSidebar && !selectedUser && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowLeftSidebar(true)}
          style={{
            position: "fixed",
            left: "20px",
            top: "20px",
            zIndex: 50,
            width: "50px",
            height: "50px",
            border: "none",
            borderRadius: "50%",
            background: "transparent",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            marginTop: "-0.35rem",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
              fill="white"
            />
          </svg>
        </motion.button>
      )}

      {/* Popup para añadir usuarios */}
      {showAddUserPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              backgroundColor: cardColor,
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: `1px solid ${borderColor}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: textColor,
                }}
              >
                Seleccionar contacto
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowAddUserPopup(false);
                  setUserSearchQuery("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: textColor,
                  cursor: "pointer",
                  padding: "0.5rem",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                    fill="currentColor"
                  />
                </svg>
              </motion.button>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "50px",
                    border: `1px solid ${borderColor}`,
                    backgroundColor: backgroundColor,
                    color: textColor,
                    outline: "none",
                    fontSize: "0.9rem",
                  }}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: lightTextColor,
                  }}
                >
                  <path
                    d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: `${lightTextColor} ${cardColor}`,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: cardColor,
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: lightTextColor,
                  borderRadius: "10px",
                  border: `2px solid ${cardColor}`,
                },
              }}
            >
              {loadingUsers ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2rem",
                    textAlign: "center",
                    color: lightTextColor,
                  }}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                    Cargando usuarios...
                  </div>
                </div>
              ) : availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    style={{
                      padding: "1.25rem 2.5rem",
                      borderBottom: `1px solid ${borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: primaryColor,
                          marginRight: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          {user.nombreUsuario?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          {user.nombreUsuario || "Usuario"}
                        </div>
                        <div
                          style={{
                            color: lightTextColor,
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "0.25rem",
                          }}
                        >
                          {user.email || "Sin email"}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ backgroundColor: "#bb3200" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addNewConversation(user)}
                      style={{
                        background: primaryColor,
                        color: "white",
                        border: "none",
                        borderRadius: "50px",
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        flexShrink: 0,
                        marginLeft: "1rem",
                      }}
                    >
                      Seleccionar
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2rem",
                    textAlign: "center",
                    color: lightTextColor,
                  }}
                >
                  {userSearchQuery ? (
                    <>
                      <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                        No se encontraron usuarios
                      </div>
                      <div>Intenta con otro término de búsqueda</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                        No hay usuarios disponibles
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default PantallaMensajes;
