import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { darLike, quitarLike, loadPosts } from "../services/api";

function PublicacionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("publicacion");
  const [isMobile, setIsMobile] = useState(false);

  const userData = location.state?.user || JSON.parse(localStorage.getItem("userData"));
  const userEmail = userData?.correoElectronico;
  const userName = userData?.nombreUsuario;

  // Colores con tema anaranjado-rojizo (igual que en PantallaPrincipal)
  const primaryColor = "#FF4500";
  const accentColor = "#FF7043";
  const backgroundColor = "#121212";
  const cardColor = "#1e1e1e";
  const textColor = "#e1e1e1";
  const lightTextColor = "#a0a0a0";
  const borderColor = "#2d2d2d";

  // Cargar publicación y comentarios
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar todos los posts y filtrar el que necesitamos
        const posts = await loadPosts();
        const foundPost = posts.find(p => p.id.toString() === id);
        
        if (foundPost) {
          setPost(foundPost);
          // Simular carga de comentarios (deberías reemplazar esto con tu API real)
          const mockComments = [
            {
              id: 1,
              user: "usuario1@example.com",
              name: "Usuario Uno",
              content: "Este es un comentario de ejemplo sobre la publicación.",
              time: "10:30 AM",
              likes: 2
            },
            {
              id: 2,
              user: "usuario2@example.com",
              name: "Usuario Dos",
              content: "¡Me encanta esta publicación! Muy interesante.",
              time: "11:45 AM",
              likes: 5
            }
          ];
          setComments(mockComments);
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error cargando publicación:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Detectar si es móvil o tablet
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLike = async () => {
    try {
      if (post.isLiked) {
        await quitarLike(post.id, userEmail);
        setPost({
          ...post,
          likes: post.likes - 1,
          isLiked: false,
        });
      } else {
        await darLike(post.id, userEmail);
        setPost({
          ...post,
          likes: post.likes + 1,
          isLiked: true,
        });
      }
    } catch (error) {
      console.error("Error al manejar like:", error);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        user: userEmail,
        name: userName,
        content: newComment,
        time: "Ahora",
        likes: 0
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
    }
  };

  const handleBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: textColor
      }}>
        Cargando publicación...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: textColor
      }}>
        Publicación no encontrada
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: backgroundColor,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: textColor,
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Encabezado */}
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          padding: "1rem",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          backgroundColor: cardColor,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          style={{
            background: "transparent",
            border: "none",
            color: textColor,
            cursor: "pointer",
            padding: "0.5rem",
            marginRight: "1rem",
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
              d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z"
              fill="currentColor"
            />
          </svg>
        </motion.button>
        <h2 style={{ margin: 0, color: primaryColor }}>Publicación</h2>
      </motion.div>

      {/* Contenido principal */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Publicación */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: cardColor,
            marginBottom: "1rem"
          }}
        >
          <div style={{ display: "flex", marginBottom: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: primaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.75rem",
                flexShrink: 0,
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    marginRight: "0.25rem",
                    color: textColor,
                  }}
                >
                  {post.name}
                </span>
                <span
                  style={{
                    marginRight: "0.25rem",
                    color: lightTextColor,
                  }}
                >
                  @{post.user.split("@")[0]}
                </span>
                <span style={{ color: lightTextColor }}>· {post.time}</span>
              </div>
              <p
                style={{
                  marginBottom: "1rem",
                  color: textColor,
                  wordBreak: "break-word",
                }}
              >
                {post.content}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                      alignItems: "center",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "0.25rem" }}
                    >
                      <path
                        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{comments.length}</span>
                  </motion.button>
                </div>
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
                    alignItems: "center",
                  }}
                  onClick={handleLike}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.25rem" }}
                  >
                    <path
                      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>{post.likes}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulario para comentar */}
        <div style={{ padding: "1rem", backgroundColor: cardColor, marginBottom: "1rem" }}>
          <form onSubmit={handleCommentSubmit}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.75rem",
                  flexShrink: 0,
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
              <input
                type="text"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "50px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: backgroundColor,
                  color: textColor,
                  outline: "none",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={{
                  background: newComment.trim() ? primaryColor : "rgba(255, 69, 0, 0.5)",
                  color: "white",
                  borderRadius: "50px",
                  border: "none",
                  padding: "0.5rem 1rem",
                  marginLeft: "0.5rem",
                  cursor: newComment.trim() ? "pointer" : "not-allowed",
                }}
                disabled={!newComment.trim()}
              >
                Comentar
              </motion.button>
            </div>
          </form>
        </div>

        {/* Lista de comentarios */}
        <div>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: "1rem",
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor: cardColor,
                }}
              >
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: primaryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.75rem",
                      flexShrink: 0,
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          marginRight: "0.25rem",
                          color: textColor,
                        }}
                      >
                        {comment.name}
                      </span>
                      <span
                        style={{
                          marginRight: "0.25rem",
                          color: lightTextColor,
                        }}
                      >
                        @{comment.user.split("@")[0]}
                      </span>
                      <span style={{ color: lightTextColor }}>· {comment.time}</span>
                    </div>
                    <p
                      style={{
                        marginBottom: "0.5rem",
                        color: textColor,
                        wordBreak: "break-word",
                      }}
                    >
                      {comment.content}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: lightTextColor,
                          cursor: "pointer",
                          padding: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ marginRight: "0.25rem" }}
                        >
                          <path
                            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>{comment.likes}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{
              padding: "2rem",
              textAlign: "center",
              color: lightTextColor,
              backgroundColor: cardColor
            }}>
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicacionDetalle;