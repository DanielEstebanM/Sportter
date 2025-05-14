import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

function PantallaPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inicio");
  const [showSportsMenu, setShowSportsMenu] = useState(false);
  const [selectedSport, setSelectedSport] = useState("general");
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const userData = location.state?.user || JSON.parse(localStorage.getItem('userData'));
  const userEmail = userData?.correoElectronico;
  const userName = userData?.nombreUsuario;

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userDataMessages', JSON.stringify(userData));
    }
  }, [userData]);

  // Detectar si es móvil o tablet
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowLeftSidebar(true);
        setShowRightSidebar(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerOpacity = Math.max(0.7, 1 - Math.min(scrollY / 100, 0.3));

  // Cerrar la barra lateral opuesta cuando se abre una
  const toggleLeftSidebar = () => {
    if (isMobile && showRightSidebar) {
      setShowRightSidebar(false);
    }
    setShowLeftSidebar(!showLeftSidebar);
  };

  const toggleRightSidebar = () => {
    if (isMobile && showLeftSidebar) {
      setShowLeftSidebar(false);
    }
    setShowRightSidebar(!showRightSidebar);
  };

  // Colores con tema anaranjado-rojizo
  const primaryColor = "#FF4500";
  const accentColor = "#FF7043";
  const backgroundColor = "#121212";
  const cardColor = "#1e1e1e";
  const textColor = "#e1e1e1";
  const lightTextColor = "#a0a0a0";
  const borderColor = "#2d2d2d";

  // Datos de ejemplo para los posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "deportista1",
      name: "Juan Pérez",
      content: "¡Acabo de terminar mi mejor carrera! #running #deporte",
      time: "2h",
      likes: 24,
      comments: 5,
      shares: 3,
      isLiked: false,
      sport: "general"
    },
    {
      id: 2,
      user: "fitness_guru",
      name: "María García",
      content: "Consejos para mejorar tu rutina de entrenamiento. ¿Qué ejercicios prefieren?",
      time: "5h",
      likes: 56,
      comments: 12,
      shares: 8,
      isLiked: true,
      sport: "general"
    },
    {
      id: 3,
      user: "nutricion_activa",
      name: "Carlos López",
      content: "La alimentación es el 70% de tus resultados deportivos. Aquí algunos tips nutricionales...",
      time: "1d",
      likes: 89,
      comments: 15,
      shares: 20,
      isLiked: false,
      sport: "general"
    },
    {
      id: 4,
      user: "futbolista22",
      name: "Luis Fernández",
      content: "Gran partido hoy con el equipo. ¡Goleada 4-0! ⚽ #fútbol #victoria",
      time: "3h",
      likes: 45,
      comments: 8,
      shares: 5,
      isLiked: false,
      sport: "fútbol"
    },
    {
      id: 5,
      user: "basquetbolista",
      name: "Ana Martínez",
      content: "Entrenamiento de tiros libres hoy. ¡100/100! 🏀 #baloncesto #entrenamiento",
      time: "6h",
      likes: 78,
      comments: 14,
      shares: 9,
      isLiked: true,
      sport: "baloncesto"
    },
    {
      id: 6,
      user: "voleyplayer",
      name: "Sofía Rodríguez",
      content: "Preparándonos para el torneo nacional de voleibol. ¡Vamos equipo! 🏐 #voleibol #equipo",
      time: "1d",
      likes: 32,
      comments: 6,
      shares: 4,
      isLiked: false,
      sport: "volleyball"
    }
  ]);

  const [newPostContent, setNewPostContent] = useState("");

  // Componentes para los iconos de deporte
  const SportIcon = ({ sport, ...props }) => {
    const icons = {
      "general": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            color="currentColor"
          >
            <path d="M2 8.571c0-2.155 0-3.232.586-3.902S4.114 4 6 4h12c1.886 0 2.828 0 3.414.67c.586.668.586 1.745.586 3.9v6.858c0 2.155 0 3.232-.586 3.902S19.886 20 18 20H6c-1.886 0-2.828 0-3.414-.67C2 18.662 2 17.585 2 15.43z"></path>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M12 10V5m0 9v5M22 9h-2.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1H22M2 9h2.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2"></path>
          </g>
        </svg>
      ),
      "fútbol": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 3.3l1.35-.95a8 8 0 0 1 4.38 3.34l-.39 1.34l-1.35.46L13 6.7zm-3.35-.95L11 5.3v1.4L7.01 9.49l-1.35-.46l-.39-1.34a8.1 8.1 0 0 1 4.38-3.34M7.08 17.11l-1.14.1A7.94 7.94 0 0 1 4 12c0-.12.01-.23.02-.35l1-.73l1.38.48l1.46 4.34zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49l.64-1.1h5.11l.64 1.11zM14.27 15H9.73l-1.35-4.02L12 8.44l3.63 2.54zm3.79 2.21l-1.14-.1l-.79-1.37l1.46-4.34l1.39-.47l1 .73c.01.11.02.22.02.34c0 1.99-.73 3.81-1.94 5.21" />
        </svg>
      ),
      "baloncesto": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2M5.23 7.75C6.1 8.62 6.7 9.74 6.91 11H4.07a8.1 8.1 0 0 1 1.16-3.25M4.07 13h2.84a5.97 5.97 0 0 1-1.68 3.25A8.1 8.1 0 0 1 4.07 13M11 19.93c-1.73-.22-3.29-1-4.49-2.14A7.95 7.95 0 0 0 8.93 13H11zM11 11H8.93A8 8 0 0 0 6.5 6.2A8.04 8.04 0 0 1 11 4.07zm8.93 0h-2.84c.21-1.26.81-2.38 1.68-3.25c.6.97 1.01 2.07 1.16 3.25M13 4.07c1.73.22 3.29.99 4.5 2.13a8 8 0 0 0-2.43 4.8H13zm0 15.86V13h2.07a8 8 0 0 0 2.42 4.79A8 8 0 0 1 13 19.93m5.77-3.68A6 6 0 0 1 17.09 13h2.84a8.1 8.1 0 0 1-1.16 3.25" />
        </svg>
      ),
      "volleyball": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 2.07c3.07.38 5.57 2.52 6.54 5.36L13 5.65zM8 5.08c1.18-.69 3.33-1.06 3-1.02v7.35l-3 1.73zM4.63 15.1c-.4-.96-.63-2-.63-3.1c0-2.02.76-3.86 2-5.27v7.58zm1.01 1.73L12 13.15l3 1.73l-6.98 4.03a7.8 7.8 0 0 1-2.38-2.08M12 20c-.54 0-1.07-.06-1.58-.16l6.58-3.8l1.36.78C16.9 18.75 14.6 20 12 20m1-8.58V7.96l7 4.05c0 1.1-.23 2.14-.63 3.09z" />
        </svg>
      ),
      "tenis": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2M5.61 16.78C4.6 15.45 4 13.8 4 12s.6-3.45 1.61-4.78a5.975 5.975 0 0 1 0 9.56M12 20c-1.89 0-3.63-.66-5-1.76c1.83-1.47 3-3.71 3-6.24S8.83 7.23 7 5.76C8.37 4.66 10.11 4 12 4s3.63.66 5 1.76c-1.83 1.47-3 3.71-3 6.24s1.17 4.77 3 6.24A7.96 7.96 0 0 1 12 20m6.39-3.22a5.975 5.975 0 0 1 0-9.56C19.4 8.55 20 10.2 20 12s-.6 3.45-1.61 4.78" />
        </svg>
      ),
      "ciclismo": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <path fill="currentColor" d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2M5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5s5-2.2 5-5s-2.2-5-5-5m0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5m5.8-10l2.4-2.4l.8.8c1.06 1.06 2.38 1.78 3.96 2.02c.6.09 1.14-.39 1.14-1c0-.49-.37-.91-.85-.99c-1.11-.18-2.02-.71-2.75-1.43l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4c0 .6.2 1.1.6 1.4L11 14v4c0 .55.45 1 1 1s1-.45 1-1v-4.4c0-.52-.2-1.01-.55-1.38zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5s5-2.2 5-5s-2.2-5-5-5m0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5" />
        </svg>
      )
    };

    return icons[sport] || icons.general;
  };

  // Deportes disponibles
  const availableSports = ["general", "fútbol", "baloncesto", "volleyball", "tenis", "ciclismo"];

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        user: userEmail.split('@')[0],
        name: userName,
        content: newPostContent,
        time: "ahora",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        sport: selectedSport
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setShowPostModal(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setShowSportsMenu(false);
  };

  const filteredPosts = selectedSport === "general"
    ? posts
    : posts.filter(post => post.sport === selectedSport);

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
      {/* Efecto de desenfoque cuando el modal está abierto */}
      {showPostModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(5px)",
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: cardColor,
              borderRadius: "16px",
              padding: "1.5rem",
              width: "90%",
              maxWidth: "600px",
              border: `1px solid ${borderColor}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>Crear publicación</h3>
              <button
                onClick={() => setShowPostModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: textColor,
                  cursor: "pointer",
                  fontSize: "1.5rem"
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePostSubmit}>
              <div style={{ display: "flex" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.75rem",
                  flexShrink: 0
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                    <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                    <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <textarea
                    placeholder="¿Qué está pasando?"
                    rows="4"
                    style={{
                      width: "100%",
                      fontSize: "1.2rem",
                      resize: "none",
                      backgroundColor: "transparent",
                      color: textColor,
                      border: "none",
                      outline: "none",
                      padding: 0
                    }}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    autoFocus
                  ></textarea>
                </div>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem",
                borderTop: `1px solid ${borderColor}`,
                paddingTop: "1rem"
              }}>
                <div style={{ display: "flex" }}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: accentColor,
                      cursor: "pointer",
                      padding: "0.5rem",
                      marginRight: "0.5rem"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor" />
                      <path d="M14 14H15.5V10.5H17.5V9H15.5V7H14V9H12V10.5H14V14Z" fill="currentColor" />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: accentColor,
                      cursor: "pointer",
                      padding: "0.5rem",
                      marginRight: "0.5rem"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z" fill="currentColor" />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: accentColor,
                      cursor: "pointer",
                      padding: "0.5rem",
                      marginRight: "0.5rem"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 13.5H11.5V8.5H9.5V13.5ZM12 6.5C12.28 6.5 12.5 6.72 12.5 7V8C12.5 8.28 12.28 8.5 12 8.5C11.72 8.5 11.5 8.28 11.5 8V7C11.5 6.72 11.72 6.5 12 6.5ZM18 15.5V8.5H6V15.5H18ZM20 17.5H4V7.5H7V3.5H17V7.5H20V17.5ZM9 5.5H15V3.5H9V5.5Z" fill="currentColor" />
                    </svg>
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    background: newPostContent.trim() ? primaryColor : "rgba(255, 69, 0, 0.5)",
                    color: "white",
                    borderRadius: "30px",
                    border: "none",
                    padding: "8px 24px",
                    cursor: newPostContent.trim() ? "pointer" : "not-allowed",
                    fontWeight: "bold",
                    fontSize: "1rem"
                  }}
                  disabled={!newPostContent.trim()}
                >
                  Publicar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Barra lateral izquierda - ahora flotante */}
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
          onClick={toggleLeftSidebar}
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
              backgroundColor: "rgba(255, 112, 67, 0.1)",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem",
              borderRadius: "8px"
            }}
            onClick={() => {
              setActiveTab("inicio");
              isMobile && setShowLeftSidebar(false);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
              <path
                fill="none"
                stroke="currentColor"
                d="M2 11.5h2a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V6.5h.389a.496.496 0 0 0 .413-.838L6.422.681a.59.59 0 0 0-.844 0L.698 5.662a.496.496 0 0 0 .413.838H1.5V11a.5.5 0 0 0 .5.5z"
              ></path>
            </svg>
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
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2rem",
              textAlign: "left",
              padding: "0.5rem"
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
              initial={false}
              animate={{
                rotate: activeTab === "mensajes" ? 10 : 0,
                scale: activeTab === "mensajes" ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 500 }}
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: primaryColor,
              color: "white",
              borderRadius: "30px",
              border: "none",
              fontSize: "1rem",
              padding: "10px 20px",
              fontWeight: "bold",
              marginTop: "1rem",
              width: "100%"
            }}
            onClick={() => {
              setShowPostModal(true);
              isMobile && setShowLeftSidebar(false);
            }}
          >
            Publicar
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
            <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{userName.charAt(0).toUpperCase() + userName.slice(1)}</div>
            <div style={{ color: lightTextColor, fontSize: "0.8rem", overflow: "hidden" }}>{userEmail}</div>
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
        display: "flex"
      }}>
        {/* Contenido central */}
        <div style={{
          flex: 1,
          minWidth: 0,
          maxWidth: isMobile ? "100%" : "calc(100% - 350px)",
          display: "flex",
          flexDirection: "column",
          height: "100vh"
        }}>
          {/* Encabezado */}
          <motion.div
            style={{
              position: "sticky",
              top: 0,
              padding: "1rem",
              borderBottom: `1px solid ${borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 10,
              backgroundColor: `rgba(30, 30, 30, ${headerOpacity})`,
              transition: "background-color 0.3s ease"
            }}
          >
            {/* Botón para mostrar barra izquierda en móviles */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLeftSidebar}
                style={{
                  background: "transparent",
                  border: "none",
                  color: textColor,
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor" />
                </svg>
              </motion.button>
            )}

            <motion.h2
              style={{
                fontWeight: "bold",
                margin: 0,
                color: primaryColor,
                flex: 1,
                textAlign: isMobile ? "center" : "left",
                opacity: headerOpacity
              }}
            >
              Inicio
            </motion.h2>

            {/* Botón de deportes modificado */}
            <div style={{ position: "relative" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: primaryColor,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
                  opacity: headerOpacity
                }}
                onClick={() => setShowSportsMenu(!showSportsMenu)}
              >
                <SportIcon sport={selectedSport} style={{ width: "24px", height: "24px", color: "white" }} />
              </motion.button>

              {/* Menú desplegable de deportes - solo iconos */}
              {showSportsMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: 0,
                    backgroundColor: cardColor,
                    borderRadius: "12px",
                    padding: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    zIndex: 20,
                    width: "auto",
                    border: `1px solid ${borderColor}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}
                >
                  {availableSports
                    .filter(sport => sport !== selectedSport)
                    .map((sport) => (
                      <motion.button
                        key={sport}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px"
                        }}
                        onClick={() => handleSportSelect(sport)}
                        title={sport === "general" ? "General" : sport.charAt(0).toUpperCase() + sport.slice(1)}
                      >
                        <SportIcon sport={sport} style={{
                          width: "24px",
                          height: "24px",
                          color: "white"
                        }} />
                      </motion.button>
                    ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Botón para mostrar barra derecha en móviles */}
          {isMobile && !showRightSidebar && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleRightSidebar}
              style={{
                position: "fixed",
                right: "20px",
                bottom: "20px",
                zIndex: 50,
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: primaryColor,
                border: "none",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 12H17V14H7V12ZM7 9H17V11H7V9Z" fill="white" />
              </svg>
            </motion.button>
          )}

          <div style={{
            flex: 1,
            overflowY: "auto",
            // Estilos personalizados para el scroll
            scrollbarWidth: "thin",
            scrollbarColor: `${lightTextColor} ${backgroundColor}`,
            '&::-webkit-scrollbar': {
              width: "8px"
            },
            '&::-webkit-scrollbar-track': {
              background: backgroundColor
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: lightTextColor,
              borderRadius: "10px",
              border: `2px solid ${backgroundColor}`
            }
          }}>
            {/* Crear nuevo post */}
            <div style={{
              padding: "1rem",
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: cardColor,
              border: `1px solid ${borderColor}`,
              borderRadius: "8px",
              margin: "1rem"
            }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowPostModal(true);
              }}>
                <div style={{ display: "flex" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: primaryColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.75rem",
                    flexShrink: 0
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                      <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                      <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input
                      placeholder="¿Qué está pasando?"
                      style={{
                        width: "100%",
                        fontSize: "1.2rem",
                        backgroundColor: "transparent",
                        color: textColor,
                        border: "none",
                        outline: "none",
                        padding: "0.5rem 0"
                      }}
                      readOnly
                      onClick={() => setShowPostModal(true)}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Lista de posts */}

            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: "1rem",
                  borderBottom: `1px solid ${borderColor}`,
                  display: "flex",
                  backgroundColor: cardColor
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.75rem",
                  flexShrink: 0
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                    <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                    <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.25rem"
                  }}>
                    <span style={{
                      fontWeight: "bold",
                      marginRight: "0.25rem",
                      color: textColor
                    }}>{post.name}</span>
                    <span style={{
                      marginRight: "0.25rem",
                      color: lightTextColor
                    }}>@{post.user}</span>
                    <span style={{ color: lightTextColor }}>· {post.time}</span>
                    {post.sport !== "general" && (
                      <span style={{
                        marginLeft: "0.5rem",
                        color: primaryColor,
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <SportIcon sport={post.sport} style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "0.25rem",
                          color: "white"
                        }} />
                        {post.sport}
                      </span>
                    )}
                  </div>
                  <p style={{
                    marginBottom: "0.5rem",
                    color: textColor,
                    wordBreak: "break-word"
                  }}>{post.content}</p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: "100%"
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: lightTextColor,
                        cursor: "pointer",
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.25rem" }}>
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor" />
                      </svg>
                      <span>{post.comments}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: lightTextColor,
                        cursor: "pointer",
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.25rem" }}>
                        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor" />
                      </svg>
                      <span>{post.shares}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: post.isLiked ? accentColor : lightTextColor,
                        cursor: "pointer",
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                      onClick={() => handleLike(post.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.25rem" }}>
                        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor" />
                      </svg>
                      <span>{post.likes}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: lightTextColor,
                        cursor: "pointer",
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Barra lateral derecha - versión flotante */}
        {!isMobile && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: showRightSidebar ? 0 : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: "350px",
              height: "100vh",
              borderLeft: `1px solid ${borderColor}`,
              backgroundColor: cardColor,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              right: 0,
              top: 0,
              zIndex: 30,
              overflowY: "auto",
              //Scroll
              scrollbarWidth: "thin",
              scrollbarColor: `${lightTextColor} ${backgroundColor}`,
              '&::-webkit-scrollbar': {
                width: "8px"
              },
              '&::-webkit-scrollbar-track': {
                background: backgroundColor
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: lightTextColor,
                borderRadius: "10px",
                border: `2px solid ${backgroundColor}`
              }
            }}
          >
            {/* Buscador */}
            <div style={{
              padding: "1rem",
              borderRadius: "1rem",
              marginBottom: "1rem",
              backgroundColor: backgroundColor
            }}>
              <div style={{
                position: "relative",
                marginBottom: "1rem"
              }}>
                <input
                  type="text"
                  placeholder="Buscar en Sportter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "50px",
                    border: `1px solid ${borderColor}`,
                    backgroundColor: cardColor,
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

            <div style={{
              padding: "1rem",
              borderRadius: "1rem",
              marginBottom: "1rem",
              backgroundColor: backgroundColor
            }}>
              <h3 style={{
                fontWeight: "bold",
                marginBottom: "1rem",
                color: textColor
              }}>Tendencias para ti</h3>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>Tendencia en Deportes</div>
                <div style={{
                  fontWeight: "bold",
                  color: textColor
                }}>#Running</div>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>2,450 posts</div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>Tendencia en Fitness</div>
                <div style={{
                  fontWeight: "bold",
                  color: textColor
                }}>#EntrenamientoEnCasa</div>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>1,890 posts</div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>Tendencia en Nutrición</div>
                <div style={{
                  fontWeight: "bold",
                  color: textColor
                }}>#AlimentaciónSaludable</div>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>3,210 posts</div>
              </div>
            </div>

            <div style={{
              padding: "1rem",
              borderRadius: "1rem",
              backgroundColor: backgroundColor
            }}>
              <h3 style={{
                fontWeight: "bold",
                marginBottom: "1rem",
                color: textColor
              }}>A quién seguir</h3>
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: primaryColor,
                  marginRight: "0.5rem"
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: "bold",
                    color: textColor
                  }}>Entrenador Profesional</div>
                  <div style={{
                    color: lightTextColor,
                    fontSize: "0.8rem"
                  }}>@entrenadorpro</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: primaryColor,
                    color: "white",
                    borderRadius: "30px",
                    border: "none",
                    padding: "5px 15px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Seguir
                </motion.button>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: primaryColor,
                  marginRight: "0.5rem"
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: "bold",
                    color: textColor
                  }}>Nutricionista Deportivo</div>
                  <div style={{
                    color: lightTextColor,
                    fontSize: "0.8rem"
                  }}>@nutrideport</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: primaryColor,
                    color: "white",
                    borderRadius: "30px",
                    border: "none",
                    padding: "5px 15px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Seguir
                </motion.button>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: primaryColor,
                  marginRight: "0.5rem"
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: "bold",
                    color: textColor
                  }}>Comunidad Fitness</div>
                  <div style={{
                    color: lightTextColor,
                    fontSize: "0.8rem"
                  }}>@fitnesscomunidad</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: primaryColor,
                    color: "white",
                    borderRadius: "30px",
                    border: "none",
                    padding: "5px 15px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Seguir
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: accentColor,
                  cursor: "pointer",
                  padding: 0,
                  marginTop: "1rem",
                  textAlign: "left"
                }}
              >
                Mostrar más
              </motion.button>
            </div>

            <div style={{
              marginTop: "auto",
              padding: "1rem"
            }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "0.5rem"
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: lightTextColor,
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem"
                  }}
                >
                  Términos de servicio
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: lightTextColor,
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem"
                  }}
                >
                  Política de privacidad
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: lightTextColor,
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem"
                  }}
                >
                  Cookies
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: lightTextColor,
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem"
                  }}
                >
                  Accesibilidad
                </motion.button>
              </div>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>© 2025 Sportter, Inc.</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Barra lateral derecha - versión móvil (flotante) */}
      {isMobile && showRightSidebar && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: showRightSidebar ? 0 : '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            width: "80%",
            height: "100vh",
            borderLeft: `1px solid ${borderColor}`,
            backgroundColor: cardColor,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: 40,
            overflowY: "auto",
            //Scroll
            scrollbarWidth: "thin",
            scrollbarColor: `${lightTextColor} ${backgroundColor}`,
            '&::-webkit-scrollbar': {
              width: "8px"
            },
            '&::-webkit-scrollbar-track': {
              background: backgroundColor
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: lightTextColor,
              borderRadius: "10px",
              border: `2px solid ${backgroundColor}`
            }
          }}
        >
          {/* Botón para cerrar en móviles */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleRightSidebar}
            style={{
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              color: textColor,
              cursor: "pointer",
              padding: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
            </svg>
          </motion.button>

          {/* Buscador */}
          <div style={{
            padding: "1rem",
            borderRadius: "1rem",
            marginBottom: "1rem",
            backgroundColor: backgroundColor
          }}>
            <div style={{
              position: "relative",
              marginBottom: "1rem"
            }}>
              <input
                type="text"
                placeholder="Buscar en Sportter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "50px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: cardColor,
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

          <div style={{
            padding: "1rem",
            borderRadius: "1rem",
            marginBottom: "1rem",
            backgroundColor: backgroundColor
          }}>
            <h3 style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              color: textColor
            }}>Tendencias para ti</h3>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>Tendencia en Deportes</div>
              <div style={{
                fontWeight: "bold",
                color: textColor
              }}>#Running</div>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>2,450 posts</div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>Tendencia en Fitness</div>
              <div style={{
                fontWeight: "bold",
                color: textColor
              }}>#EntrenamientoEnCasa</div>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>1,890 posts</div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>Tendencia en Nutrición</div>
              <div style={{
                fontWeight: "bold",
                color: textColor
              }}>#AlimentaciónSaludable</div>
              <div style={{
                color: lightTextColor,
                fontSize: "0.8rem"
              }}>3,210 posts</div>
            </div>
          </div>

          <div style={{
            padding: "1rem",
            borderRadius: "1rem",
            backgroundColor: backgroundColor
          }}>
            <h3 style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              color: textColor
            }}>A quién seguir</h3>
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: primaryColor,
                marginRight: "0.5rem"
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: "bold",
                  color: textColor
                }}>Entrenador Profesional</div>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>@entrenadorpro</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: primaryColor,
                  color: "white",
                  borderRadius: "30px",
                  border: "none",
                  padding: "5px 15px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Seguir
              </motion.button>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: primaryColor,
                marginRight: "0.5rem"
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: "bold",
                  color: textColor
                }}>Nutricionista Deportivo</div>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>@nutrideport</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: primaryColor,
                  color: "white",
                  borderRadius: "30px",
                  border: "none",
                  padding: "5px 15px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Seguir
              </motion.button>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: primaryColor,
                marginRight: "0.5rem"
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: "bold",
                  color: textColor
                }}>Comunidad Fitness</div>
                <div style={{
                  color: lightTextColor,
                  fontSize: "0.8rem"
                }}>@fitnesscomunidad</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: primaryColor,
                  color: "white",
                  borderRadius: "30px",
                  border: "none",
                  padding: "5px 15px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Seguir
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "transparent",
                border: "none",
                color: accentColor,
                cursor: "pointer",
                padding: 0,
                marginTop: "1rem",
                textAlign: "left"
              }}
            >
              Mostrar más
            </motion.button>
          </div>

          <div style={{
            marginTop: "auto",
            padding: "1rem"
          }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              marginBottom: "0.5rem"
            }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: lightTextColor,
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.8rem",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem"
                }}
              >
                Términos de servicio
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: lightTextColor,
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.8rem",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem"
                }}
              >
                Política de privacidad
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: lightTextColor,
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.8rem",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem"
                }}
              >
                Cookies
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: lightTextColor,
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.8rem",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem"
                }}
              >
                Accesibilidad
              </motion.button>
            </div>
            <div style={{
              color: lightTextColor,
              fontSize: "0.8rem"
            }}>© 2025 Sportter, Inc.</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PantallaPrincipal;