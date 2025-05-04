import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

function PantallaPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.user || "usuario@ejemplo.com";
  const [activeTab, setActiveTab] = useState("inicio");

  // Colores y estilos consistentes con PantallaInicio
  const primaryGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const accentColor = "#9f7aea";
  const textColor = "#4a5568";
  const lightTextColor = "#718096";
  const borderColor = "#e2e8f0";

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
      isLiked: false
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
      isLiked: true
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
      isLiked: false
    }
  ]);

  const [newPostContent, setNewPostContent] = useState("");

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
        name: userEmail.split('@')[0],
        content: newPostContent,
        time: "ahora",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="d-flex" style={{
      minHeight: "100vh",
      backgroundColor: "white",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Barra lateral izquierda */}
      <div className="d-flex flex-column p-3 border-end" style={{
        width: "250px",
        height: "100vh",
        position: "sticky",
        top: 0,
        borderColor: borderColor
      }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mb-4 p-2 rounded-circle d-flex justify-content-center"
          style={{ width: "50px", cursor: "pointer" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill={accentColor} />
            <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill={accentColor} />
            <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill={accentColor} />
          </svg>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`btn btn-lg d-flex align-items-center mb-3 ${activeTab === "inicio" ? "fw-bold" : ""}`}
          style={{
            color: activeTab === "inicio" ? accentColor : textColor,
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem"
          }}
          onClick={() => setActiveTab("inicio")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
            <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={activeTab === "inicio" ? accentColor : textColor} />
          </svg>
          Inicio
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`btn btn-lg d-flex align-items-center mb-3 ${activeTab === "explorar" ? "fw-bold" : ""}`}
          style={{
            color: activeTab === "explorar" ? accentColor : textColor,
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem"
          }}
          onClick={() => setActiveTab("explorar")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill={activeTab === "explorar" ? accentColor : textColor} />
          </svg>
          Explorar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`btn btn-lg d-flex align-items-center mb-3 ${activeTab === "notificaciones" ? "fw-bold" : ""}`}
          style={{
            color: activeTab === "notificaciones" ? accentColor : textColor,
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem"
          }}
          onClick={() => setActiveTab("notificaciones")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill={activeTab === "notificaciones" ? accentColor : textColor} />
          </svg>
          Notificaciones
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`btn btn-lg d-flex align-items-center mb-3 ${activeTab === "mensajes" ? "fw-bold" : ""}`}
          style={{
            color: activeTab === "mensajes" ? accentColor : textColor,
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem"
          }}
          onClick={() => setActiveTab("mensajes")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill={activeTab === "mensajes" ? accentColor : textColor} />
          </svg>
          Mensajes
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`btn btn-lg d-flex align-items-center mb-3 ${activeTab === "perfil" ? "fw-bold" : ""}`}
          style={{
            color: activeTab === "perfil" ? accentColor : textColor,
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.2rem"
          }}
          onClick={() => setActiveTab("perfil")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill={activeTab === "perfil" ? accentColor : textColor} />
          </svg>
          Perfil
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-lg mt-4 fw-bold"
          style={{
            background: primaryGradient,
            color: "white",
            borderRadius: "30px",
            border: "none",
            fontSize: "1rem",
            padding: "10px 20px"
          }}
        >
          Publicar
        </motion.button>

        <div className="mt-auto mb-3 d-flex align-items-center">
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill={accentColor} />
              <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill={accentColor} />
              <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill={accentColor} />
            </svg>
          </div>
          <div className="ms-2">
            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{userEmail.split('@')[0]}</div>
            <div className="text-muted" style={{ fontSize: "0.8rem" }}>@{userEmail.split('@')[0]}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ms-auto btn btn-link p-0"
            onClick={handleLogout}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill={textColor} />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1" style={{ maxWidth: "600px", borderRight: `1px solid ${borderColor}` }}>
        {/* Encabezado */}
        <div className="sticky-top bg-white p-3 border-bottom d-flex align-items-center" style={{
          borderColor: borderColor,
          zIndex: 10
        }}>
          <h2 className="fw-bold m-0" style={{
            background: primaryGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Inicio
          </h2>
        </div>

        {/* Crear nuevo post */}
        <div className="p-3 border-bottom" style={{ borderColor: borderColor }}>
          <form onSubmit={handlePostSubmit}>
            <div className="d-flex">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{
                width: "48px",
                height: "48px",
                background: primaryGradient
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                  <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                  <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                </svg>
              </div>
              <div className="flex-grow-1">
                <textarea
                  className="form-control border-0 p-0"
                  placeholder="¿Qué está pasando?"
                  rows="2"
                  style={{
                    fontSize: "1.2rem",
                    resize: "none",
                    boxShadow: "none"
                  }}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                ></textarea>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="d-flex">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-link p-0 me-2"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill={accentColor} />
                        <path d="M14 14H15.5V10.5H17.5V9H15.5V7H14V9H12V10.5H14V14Z" fill={accentColor} />
                      </svg>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-link p-0 me-2"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z" fill={accentColor} />
                      </svg>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-link p-0 me-2"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 13.5H11.5V8.5H9.5V13.5ZM12 6.5C12.28 6.5 12.5 6.72 12.5 7V8C12.5 8.28 12.28 8.5 12 8.5C11.72 8.5 11.5 8.28 11.5 8V7C11.5 6.72 11.72 6.5 12 6.5ZM18 15.5V8.5H6V15.5H18ZM20 17.5H4V7.5H7V3.5H17V7.5H20V17.5ZM9 5.5H15V3.5H9V5.5Z" fill={accentColor} />
                      </svg>
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn fw-bold"
                    style={{
                      background: newPostContent.trim() ? primaryGradient : "rgba(102, 126, 234, 0.5)",
                      color: "white",
                      borderRadius: "30px",
                      border: "none",
                      padding: "5px 20px",
                      cursor: newPostContent.trim() ? "pointer" : "not-allowed"
                    }}
                    disabled={!newPostContent.trim()}
                  >
                    Publicar
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Lista de posts */}
        <div>
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 border-bottom d-flex"
              style={{ borderColor: borderColor }}
            >
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{
                width: "48px",
                height: "48px",
                background: primaryGradient
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="white" />
                  <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="white" />
                  <path d="M6.5 17.5C7.33 15.5 9.5 14 12 14C14.5 14 16.67 15.5 17.5 17.5H6.5Z" fill="white" />
                </svg>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <span className="fw-bold me-1">{post.name}</span>
                  <span className="text-muted me-1">@{post.user}</span>
                  <span className="text-muted">· {post.time}</span>
                </div>
                <p className="mb-2" style={{ color: textColor }}>{post.content}</p>
                <div className="d-flex justify-content-between" style={{ maxWidth: "400px" }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-link p-0 d-flex align-items-center"
                    style={{ color: lightTextColor }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor" />
                    </svg>
                    <span>{post.comments}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-link p-0 d-flex align-items-center"
                    style={{ color: lightTextColor }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor" />
                    </svg>
                    <span>{post.shares}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-link p-0 d-flex align-items-center"
                    onClick={() => handleLike(post.id)}
                    style={{ color: post.isLiked ? accentColor : lightTextColor }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor" />
                    </svg>
                    <span>{post.likes}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-link p-0 d-flex align-items-center"
                    style={{ color: lightTextColor }}
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

      {/* Barra lateral derecha */}
      <div className="d-none d-lg-flex flex-column p-3" style={{ width: "350px" }}>
        <div className="bg-light p-3 rounded-4 mb-3">
          <h3 className="fw-bold mb-3" style={{ color: textColor }}>Tendencias para ti</h3>
          <div className="mb-3">
            <div className="text-muted small">Tendencia en Deportes</div>
            <div className="fw-bold">#Running</div>
            <div className="text-muted small">2,450 posts</div>
          </div>
          <div className="mb-3">
            <div className="text-muted small">Tendencia en Fitness</div>
            <div className="fw-bold">#EntrenamientoEnCasa</div>
            <div className="text-muted small">1,890 posts</div>
          </div>
          <div className="mb-3">
            <div className="text-muted small">Tendencia en Nutrición</div>
            <div className="fw-bold">#AlimentaciónSaludable</div>
            <div className="text-muted small">3,210 posts</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-link p-0"
            style={{ color: accentColor }}
          >
            Mostrar más
          </motion.button>
        </div>

        <div className="bg-light p-3 rounded-4">
          <h3 className="fw-bold mb-3" style={{ color: textColor }}>A quién seguir</h3>
          <div className="d-flex align-items-center mb-3">
            <div className="rounded-circle bg-primary me-2" style={{ width: "40px", height: "40px" }}></div>
            <div className="flex-grow-1">
              <div className="fw-bold">Entrenador Profesional</div>
              <div className="text-muted small">@entrenadorpro</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm fw-bold"
              style={{
                background: primaryGradient,
                color: "white",
                borderRadius: "30px",
                border: "none",
                padding: "5px 15px"
              }}
            >
              Seguir
            </motion.button>
          </div>
          <div className="d-flex align-items-center mb-3">
            <div className="rounded-circle bg-success me-2" style={{ width: "40px", height: "40px" }}></div>
            <div className="flex-grow-1">
              <div className="fw-bold">Nutricionista Deportivo</div>
              <div className="text-muted small">@nutrideport</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm fw-bold"
              style={{
                background: primaryGradient,
                color: "white",
                borderRadius: "30px",
                border: "none",
                padding: "5px 15px"
              }}
            >
              Seguir
            </motion.button>
          </div>      <div className="d-flex align-items-center">
            <div className="rounded-circle bg-warning me-2" style={{ width: "40px", height: "40px" }}></div>
            <div className="flex-grow-1">
              <div className="fw-bold">Comunidad Fitness</div>
              <div className="text-muted small">@fitnesscomunidad</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm fw-bold"
              style={{
                background: primaryGradient,
                color: "white",
                borderRadius: "30px",
                border: "none",
                padding: "5px 15px"
              }}
            >
              Seguir
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-link p-0 mt-3"
            style={{ color: accentColor }}
          >
            Mostrar más
          </motion.button>
        </div>

        <div className="mt-3 p-3">
          <div className="d-flex flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-link p-0 me-2 mb-2"
              style={{ color: lightTextColor, fontSize: "0.8rem" }}
            >
              Términos de servicio
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-link p-0 me-2 mb-2"
              style={{ color: lightTextColor, fontSize: "0.8rem" }}
            >
              Política de privacidad
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-link p-0 me-2 mb-2"
              style={{ color: lightTextColor, fontSize: "0.8rem" }}
            >
              Cookies
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-link p-0 me-2 mb-2"
              style={{ color: lightTextColor, fontSize: "0.8rem" }}
            >
              Accesibilidad
            </motion.button>
          </div>
          <div className="text-muted small">© 2023 Sportter, Inc.</div>
        </div>
      </div>
    </div>
  );
}

export default PantallaPrincipal;