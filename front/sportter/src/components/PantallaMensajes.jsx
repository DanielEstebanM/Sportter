import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { filter } from "framer-motion/client";

function PantallaMensajes() {
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.user || "usuario@ejemplo.com";
    const [activeTab, setActiveTab] = useState("mensajes");
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Colores con tema anaranjado-rojizo
    const primaryColor = "#FF4500";
    const accentColor = "#FF7043";
    const backgroundColor = "#121212";
    const cardColor = "#1e1e1e";
    const textColor = "#e1e1e1";
    const lightTextColor = "#a0a0a0";
    const borderColor = "#2d2d2d";

    // Datos de ejemplo para conversaciones
    const [conversations, setConversations] = useState([
        {
            id: 1,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 2,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 3,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 4,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 5,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 6,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 7,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 8,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 9,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 10,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 11,
            user: "Frang2004",
            username: "Franngf2004",
            avatar: "",
            lastMessage: "JSISISIS q estoy usando X como lienzo para el TFG",
            time: "41s",
            unread: true,
            messages: [
                {
                    id: 1,
                    content: "Sitgo pensando en ella",
                    time: "17 sept. 2023 12:48 p. m.",
                    sender: "Frang2004",
                    isUser: false
                },
                {
                    id: 2,
                    content: "bus JAAJJAJA quien le diera a ese Fran cómo va a acabar",
                    time: "23 sept. 2023 13:00 p. m.",
                    sender: "user",
                    isUser: true
                },
                {
                    id: 3,
                    content: "JSISISIS q estoy usando X como lienzo para el TFG",
                    time: "11:04 a. m.",
                    sender: "Frang2004",
                    isUser: false
                }
            ]
        },
        {
            id: 12,
            user: "Paola",
            username: "Itsypaola",
            avatar: "",
            lastMessage: "Compartió un post",
            time: "25 ago. 2023",
            unread: false,
            messages: [
                {
                    id: 1,
                    content: "Hola! Cómo estás?",
                    time: "24 ago. 2023 10:30 a. m.",
                    sender: "Paola",
                    isUser: false
                },
                {
                    id: 2,
                    content: "Mira este post interesante",
                    time: "25 ago. 2023 3:15 p. m.",
                    sender: "Paola",
                    isUser: false,
                    isPost: true
                }
            ]
        },
        {
            id: 13,
            user: "Sergio Franco",
            username: "Franco_ross",
            avatar: "",
            lastMessage: "",
            time: "1 may. 2023",
            unread: false,
            messages: []
        }
    ]);

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
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedUser) {
            const updatedConversations = conversations.map(conv => {
                if (conv.id === selectedUser.id) {
                    const newMsg = {
                        id: conv.messages.length + 1,
                        content: newMessage,
                        time: "Ahora",
                        sender: "user",
                        isUser: true
                    };
                    return {
                        ...conv,
                        lastMessage: newMessage,
                        time: "Ahora",
                        messages: [...conv.messages, newMsg]
                    };
                }
                return conv;
            });
            setConversations(updatedConversations);
            setNewMessage("");
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const filteredConversations = searchQuery
        ? conversations.filter(conv =>
            conv.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.username.toLowerCase().includes(searchQuery.toLowerCase()))
        : conversations;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: backgroundColor,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: textColor,
            display: "flex",
            overflowX: "hidden",
            position: "relative"
        }}>
            {/* Barra lateral izquierda */}
            <motion.div
                initial={{ x: isMobile ? -250 : 0 }}
                animate={{ x: showLeftSidebar ? 0 : (isMobile ? -250 : 0) }}
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
                    overflowY: "auto"
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
                        padding: "10px"
                    }}
                    onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                >
                    <img
                        src="https://i.imgur.com/vVkxceM.png"
                        alt="Logo"
                        style={{ width: "100%", height: "100%", objectFit: "contain", filter: "invert()" }}
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
                                navigate('/principal', {
                                    state: { user: userEmail },
                                    replace: false
                                });
                                document.body.style.overflow = ""; // Restaura el scroll
                            }, 300);
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                rotate: activeTab === "inicio" ? 10 : 0,  // Mismo efecto de inclinación de 10 grados
                                scale: activeTab === "inicio" ? 1.1 : 1    // Mismo escalado del 10%
                            }}
                            transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
                            style={{ marginBottom: "0.10rem" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
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
                            padding: "0.5rem"
                        }}
                        onClick={() => {
                            setActiveTab("explorar");
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                rotate: activeTab === "explorar" ? 10 : 0,  // Mismo efecto de inclinación de 10 grados
                                scale: activeTab === "explorar" ? 1.1 : 1    // Mismo escalado del 10%
                            }}
                            transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
                            style={{ marginBottom: "0.20rem" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
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
                            padding: "0.5rem"
                        }}
                        onClick={() => {
                            setActiveTab("eventos");
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                rotate: activeTab === "eventos" ? 10 : 0,  // Mismo efecto de inclinación de 10 grados
                                scale: activeTab === "eventos" ? 1.1 : 1    // Mismo escalado del 10%
                            }}
                            transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
                            style={{ marginBottom: "0.20rem" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
                                <path d="M16 10H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1m3-7h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-1 16H6c-.55 0-1-.45-1-1V8h14v10c0 .55-.45 1-1 1m-5-5H8c-.55 0-1 .45-1 1s.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1" fill={activeTab === "eventos" ? accentColor : textColor} />
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
                            borderRadius: "8px"
                        }}
                        onClick={() => {
                            setActiveTab("mensajes");
                            isMobile && setShowLeftSidebar(false);

                            // Efecto de transición
                            document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
                            setTimeout(() => {
                                navigate('/mensajes', {
                                    state: { user: userEmail },
                                    replace: false
                                });
                                document.body.style.overflow = ""; // Restaura el scroll
                            }, 300);
                        }}
                    >
                        <motion.div
                            style={{ marginRight: "0.75rem" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            padding: "0.5rem"
                        }}
                        onClick={() => {
                            setActiveTab("perfil");
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                rotate: activeTab === "perfil" ? 10 : 0,  // Mismo efecto de inclinación de 10 grados
                                scale: activeTab === "perfil" ? 1.1 : 1    // Mismo escalado del 10%
                            }}
                            transition={{ type: "spring", stiffness: 500 }} // Misma animación spring
                            style={{ marginBottom: "0.20rem" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
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

                <div style={{
                    marginTop: "auto",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    borderRadius: "50px",
                    cursor: "pointer",
                    ":hover": { backgroundColor: "rgba(255,255,255,0.1)" }
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: primaryColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "0.5rem"
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                            <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                            <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                        </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{userEmail.split('@')[0]}</div>
                        <div style={{ color: lightTextColor, fontSize: "0.8rem" }}>@{userEmail.split('@')[0]}</div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: textColor,
                            cursor: "pointer",
                            padding: "0.5rem"
                        }}
                        onClick={handleLogout}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill={textColor} />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>

            {/* Contenido principal */}
            <div style={{
                flex: 1,
                minWidth: 0,
                marginLeft: isMobile ? "0" : "250px",
                backgroundColor: backgroundColor,
                display: "flex",
                height: "100vh"
            }}>
                {/* Lista de conversaciones */}
                <div style={{
                    width: isMobile ? "100%" : "350px",
                    borderRight: `1px solid ${borderColor}`,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {/* Encabezado */}
                    <div style={{
                        padding: "1rem",
                        borderBottom: `1px solid ${borderColor}`,
                        backgroundColor: cardColor,
                        position: "sticky",
                        top: 0,
                        zIndex: 10
                    }}>
                        <h2 style={{
                            fontWeight: "bold",
                            margin: 0,
                            fontSize: "1.5rem",
                            color: primaryColor,
                            marginTop: "0.5rem",
                            textAlign: isMobile ? "center" : "left",
                        }}>Mensajes</h2>

                        {/* Buscador */}
                        <div style={{
                            position: "relative",
                            marginTop: "1rem"
                        }}>
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
                                    fontSize: "0.9rem"
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
                                    color: lightTextColor
                                }}
                            >
                                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    {/* Lista de chats */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        // Estilos personalizados para el scroll
                        scrollbarWidth: "thin",
                        scrollbarColor: `${lightTextColor} ${cardColor}`,
                        '&::-webkit-scrollbar': {
                            width: "8px"
                        },
                        '&::-webkit-scrollbar-track': {
                            background: cardColor,
                            borderRadius: "10px"
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: lightTextColor,
                            borderRadius: "10px",
                            border: `2px solid ${cardColor}`
                        }
                    }}>
                        {filteredConversations.map(conversation => (
                            <motion.div
                                key={conversation.id}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                style={{
                                    padding: "1rem",
                                    borderBottom: `1px solid ${borderColor}`,
                                    backgroundColor: selectedUser?.id === conversation.id ? "rgba(255, 69, 0, 0.1)" : "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                onClick={() => setSelectedUser(conversation)}
                            >
                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: primaryColor,
                                    marginRight: "0.75rem",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                                        <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                                        <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontWeight: "bold" }}>{conversation.user}</span>
                                        <span style={{ color: lightTextColor, fontSize: "0.8rem" }}>{conversation.time}</span>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <span style={{
                                            color: conversation.unread ? textColor : lightTextColor,
                                            fontSize: "0.9rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            flex: 1
                                        }}>
                                            @{conversation.username} - {conversation.lastMessage}
                                        </span>
                                        {conversation.unread && (
                                            <div style={{
                                                width: "8px",
                                                height: "8px",
                                                borderRadius: "50%",
                                                background: primaryColor,
                                                marginLeft: "0.5rem"
                                            }}></div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Área de mensajes */}
                {!isMobile || selectedUser ? (
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        borderRight: isMobile ? "none" : `1px solid ${borderColor}`
                    }}>
                        {selectedUser ? (
                            <>
                                {/* Encabezado del chat */}
                                <div style={{
                                    padding: "1rem",
                                    borderBottom: `1px solid ${borderColor}`,
                                    backgroundColor: cardColor,
                                    display: "flex",
                                    alignItems: "center",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 10
                                }}>
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        background: primaryColor,
                                        marginRight: "0.75rem",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                                            <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                                            <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                                        </svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "bold" }}>{selectedUser.user}</div>
                                        <div style={{ color: lightTextColor, fontSize: "0.8rem" }}>@{selectedUser.username}</div>
                                    </div>
                                    {isMobile && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: textColor,
                                                cursor: "pointer",
                                                padding: "0.5rem"
                                            }}
                                            onClick={() => setSelectedUser(null)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                                            </svg>
                                        </motion.button>
                                    )}
                                </div>

                                {/* Mensajes */}
                                <div style={{
                                    flex: 1,
                                    padding: "1rem",
                                    overflowY: "auto",
                                    background: `linear-gradient(${backgroundColor}, ${cardColor})`
                                }}>
                                    {selectedUser.messages.length > 0 ? (
                                        selectedUser.messages.map(message => (
                                            <div key={message.id} style={{
                                                marginBottom: "1.5rem",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: message.isUser ? "flex-end" : "flex-start"
                                            }}>
                                                {message.sender !== selectedUser.messages[0]?.sender && (
                                                    <div style={{
                                                        color: lightTextColor,
                                                        fontSize: "0.8rem",
                                                        marginBottom: "0.25rem"
                                                    }}>
                                                        {message.sender} · {message.time}
                                                    </div>
                                                )}
                                                <div style={{
                                                    backgroundColor: message.isUser ? primaryColor : cardColor,
                                                    color: message.isUser ? "white" : textColor,
                                                    padding: "0.75rem 1rem",
                                                    borderRadius: message.isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                                    maxWidth: "70%",
                                                    wordBreak: "break-word",
                                                    border: message.isUser ? "none" : `1px solid ${borderColor}`
                                                }}>
                                                    {message.content}
                                                </div>
                                                <div style={{
                                                    color: lightTextColor,
                                                    fontSize: "0.7rem",
                                                    marginTop: "0.25rem",
                                                    alignSelf: message.isUser ? "flex-end" : "flex-start"
                                                }}>
                                                    {message.time}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            color: lightTextColor,
                                            textAlign: "center"
                                        }}>
                                            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>No hay mensajes aún</div>
                                            <div>Envía un mensaje para comenzar la conversación</div>
                                        </div>
                                    )}
                                </div>

                                {/* Enviar mensaje */}
                                <div style={{
                                    padding: "1rem",
                                    borderTop: `1px solid ${borderColor}`,
                                    backgroundColor: cardColor,
                                    position: "sticky",
                                    bottom: 0
                                }}>
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
                                                    fontSize: "0.9rem"
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
                                                    marginLeft: "0.5rem"
                                                }}
                                                disabled={!newMessage.trim()}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white" />
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "2rem",
                                textAlign: "center"
                            }}>
                                <div style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    background: `rgba(255, 69, 0, 0.1)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "1.5rem"
                                }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill={primaryColor} />
                                    </svg>
                                </div>
                                <h2 style={{
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    marginBottom: "0.5rem"
                                }}>Selecciona un mensaje</h2>
                                <p style={{
                                    color: lightTextColor,
                                    marginBottom: "1.5rem"
                                }}>Elige entre tus mensajes existentes o inicia uno nuevo.</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Botón para mostrar barra izquierda en móviles */}
            {isMobile && !showLeftSidebar && (
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
                        marginTop: "-0.35rem"
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="white" />
                    </svg>
                </motion.button>
            )}
        </div>
    );
}

export default PantallaMensajes;