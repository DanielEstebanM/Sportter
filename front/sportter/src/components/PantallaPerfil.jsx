import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

function PantallaPerfil() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("perfil");
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedContent, setSelectedContent] = useState("publicaciones");
    const [editMode, setEditMode] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [bio, setBio] = useState("Apasionado del deporte y la vida saludable. Amante del running y el baloncesto.");
    const [tempBio, setTempBio] = useState(bio);
    const [name, setName] = useState("Usuario Ejemplo");
    const [tempName, setTempName] = useState(name);
    const [profileImage, setProfileImage] = useState("https://i.imgur.com/bUwYQP3.png");

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userEmail = userData?.correoElectronico;
    const userName = userData?.nombreUsuario || name;
    const userUsername = userEmail?.split('@')[0];

    // Colores con tema anaranjado-rojizo
    const primaryColor = "#FF4500";
    const accentColor = "#FF7043";
    const backgroundColor = "#121212";
    const cardColor = "#1e1e1e";
    const textColor = "#e1e1e1";
    const lightTextColor = "#a0a0a0";
    const borderColor = "#2d2d2d";

    // Datos de ejemplo para publicaciones del perfil
    const [profilePosts, setProfilePosts] = useState([
        {
            id: 1,
            content: "¡Nuevo récord personal en 10k! 42:35 minutos. #running #deporte",
            time: "2d",
            likes: 24,
            comments: 5,
            shares: 3,
            isLiked: false,
            sport: "running"
        },
        {
            id: 2,
            content: "Entrenamiento intenso hoy en el gimnasio. ¿Alguien más está preparándose para una maratón?",
            time: "5d",
            likes: 15,
            comments: 8,
            shares: 2,
            isLiked: true,
            sport: "general"
        }
    ]);

    // Datos de ejemplo para eventos (los mismos que en PantallaEventos)
    const [events, setEvents] = useState({
        paraTi: [
            {
                id: 1,
                localTeam: "Los Tigres",
                visitorTeam: "Las Águilas",
                sport: "fútbol",
                localImage: "https://images2.minutemediacdn.com/image/upload/c_crop,w_3531,h_1986,x_0,y_232/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_es_international_web/01j5c0e6nzzxe7vxjnzk.jpg",
                visitorImage: "https://i.imgur.com/bUwYQP3.png",
                date: "2023-12-15T20:00:00",
                location: "Estadio Municipal",
                isMember: true
            },
            {
                id: 2,
                localTeam: "Los Leones",
                visitorTeam: "Los Halcones",
                sport: "baloncesto",
                localImage: "https://i.imgur.com/bUwYQP3.png",
                visitorImage: "https://i.imgur.com/bUwYQP3.png",
                date: "2023-12-18T19:30:00",
                location: "Pabellón Deportivo",
                isMember: true
            }
        ],
        comunidad: [
            {
                id: 3,
                localTeam: "Los Osos",
                visitorTeam: "Los Tiburones",
                sport: "volleyball",
                localImage: "https://i.imgur.com/bUwYQP3.png",
                visitorImage: "https://i.imgur.com/bUwYQP3.png",
                date: "2023-12-20T18:00:00",
                location: "Polideportivo Central",
                isMember: false
            }
        ]
    });

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

    const handleLike = (postId) => {
        setProfilePosts(profilePosts.map(post => {
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

    const handleSaveBio = () => {
        setBio(tempBio);
        setName(tempName);
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setTempBio(bio);
        setTempName(name);
        setEditMode(false);
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Componente para los iconos de deporte
    const SportIcon = ({ sport, ...props }) => {
        const icons = {
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
            "running": (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <path fill="currentColor" d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm-3.6 13.9l1-4.4l2.1 2v6h2v-7.5l-2.1-2l.6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1c-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7l-1.6 8.1l-4.9-1l-.4 2l7 1.4z" />
                </svg>
            ),
            "general": (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z" />
                </svg>
            )
        };

        return icons[sport] || icons["general"];
    };

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
                        src="https://i.imgur.com/bUwYQP3.png"
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
                                    state: { user: userData },
                                    replace: false
                                });
                                document.body.style.overflow = ""; // Restaura el scroll
                            }, 300);
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                rotate: activeTab === "inicio" ? 10 : 0,
                                scale: activeTab === "inicio" ? 1.1 : 1
                            }}
                            transition={{ type: "spring", stiffness: 500 }}
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

                            // Efecto de transición
                            document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
                            setTimeout(() => {
                                navigate('/equipos', {
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
                                rotate: activeTab === "explorar" ? 10 : 0,
                                scale: activeTab === "explorar" ? 1.1 : 1
                            }}
                            transition={{ type: "spring", stiffness: 500 }}
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

                            // Efecto de transición idéntico al de PantallaPrincipal
                            document.body.style.overflow = "hidden"; // Bloquea el scroll durante la transición
                            setTimeout(() => {
                                navigate('/eventos', {
                                    state: { user: userData },
                                    replace: false
                                });
                                document.body.style.overflow = ""; // Restaura el scroll
                            }, 300);
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                rotate: activeTab === "eventos" ? 10 : 0,
                                scale: activeTab === "eventos" ? 1.1 : 1
                            }}
                            transition={{ type: "spring", stiffness: 500 }}
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
                            backgroundColor: "rgba(255, 112, 67, 0.1)",
                            border: "none",
                            fontSize: "1.2rem",
                            textAlign: "left",
                            padding: "0.5rem",
                            borderRadius: "8px"
                        }}
                        onClick={() => {
                            setActiveTab("perfil");
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
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
                        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{userName?.charAt(0).toUpperCase() + userName?.slice(1)}</div>
                        <div
                            data-tooltip-id="tooltip-email"
                            data-tooltip-content={userEmail}
                            style={{
                                maxWidth: "100px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                cursor: "pointer"
                            }}
                        >
                            {userEmail}
                        </div>
                        <ReactTooltip id="tooltip-email" place="bottom" style={{ backgroundColor: "rgba(204, 112, 0, 0.27)" }} />
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
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3m8 0h9m-12-8v.01m3-7.448v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" fill="none" />
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
                flexDirection: "column"
            }}>
                {/* Encabezado del perfil */}
                <div style={{
                    position: "relative",
                    height: "200px",
                    backgroundColor: cardColor,
                    borderBottom: `1px solid ${borderColor}`
                }}>
                    {/* Portada */}
                    <div style={{
                        height: "150px",
                        backgroundColor: primaryColor,
                        opacity: 0.7
                    }}></div>

                    {/* Foto de perfil */}
                    <div style={{
                        position: "absolute",
                        top: "100px",
                        left: "20px",
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: `4px solid ${cardColor}`,
                        backgroundColor: accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                    }}>
                        {editMode ? (
                            <label htmlFor="profile-image-upload" style={{ cursor: "pointer" }}>
                                <img
                                    src={profileImage}
                                    alt="Perfil"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                                <input
                                    id="profile-image-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                            </label>
                        ) : (
                            <img
                                src={profileImage}
                                alt="Perfil"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        )}
                    </div>
                    {/* Menú de configuración */}
    <div style={{ position: "relative" }}>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: textColor,
                border: `1px solid ${lightTextColor}`,
                borderRadius: "20px",
                padding: "8px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                zIndex: 10
            }}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z" fill="currentColor" />
            </svg>
            Ajustes
        </motion.button>

        {/* Menú desplegable de configuración */}
        {showSettingsMenu && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                    position: "absolute",
                    top: "60px",
                    right: "20px",
                    backgroundColor: cardColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    width: "200px",
                    zIndex: 20,
                    overflow: "hidden"
                }}
                onMouseLeave={() => setShowSettingsMenu(false)}
            >
                <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    style={{
                        width: "100%",
                        padding: "12px 16px",
                        textAlign: "left",
                        backgroundColor: "transparent",
                        border: "none",
                        color: textColor,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                    }}
                    onClick={() => {
                        setEditMode(true);
                        setShowSettingsMenu(false);
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor" />
                    </svg>
                    Editar perfil
                </motion.button>

                <div
                    style={{
                        position: "relative",
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        ":hover": { backgroundColor: "rgba(255,255,255,0.05)" }
                                    }}
                                    onMouseEnter={() => setShowSubMenu(true)}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z" fill="currentColor" />
                                            </svg>
                                            Configuración de cuenta
                                        </div>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Submenú independiente */}
                                {showSubMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            position: "absolute",
                                            left: "px", // Aparece a la izquierda del menú principal
                                            top: 0,
                                            backgroundColor: cardColor,
                                            border: `1px solid ${borderColor}`,
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                            width: "200px",
                                            zIndex: 30
                                        }}
                                        onMouseEnter={() => setShowSubMenu(true)}
                                        onMouseLeave={() => setShowSubMenu(false)}
                                    >
                                        <motion.button
                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                textAlign: "left",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                color: textColor,
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cambiar contraseña
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ backgroundColor: "rgba(255,255,white,0.05)" }}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                textAlign: "left",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                color: "#FF5252",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Desactivar cuenta
                                        </motion.button>
                                    </motion.div>
                                )}

                                <motion.button
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        textAlign: "left",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: textColor,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                    onClick={handleLogout}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                                        <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
                                    </svg>
                                    Cerrar sesión
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Información del perfil */}
                <div style={{
                    padding: "1rem",
                    paddingTop: "60px",
                    backgroundColor: cardColor,
                    borderBottom: `1px solid ${borderColor}`
                }}>
                    {editMode ? (
                        <div>
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: "8px",
                                    padding: "0.75rem",
                                    marginBottom: "1rem",
                                    fontSize: "1.5rem",
                                    fontWeight: "bold"
                                }}
                            />
                            <textarea
                                value={tempBio}
                                onChange={(e) => setTempBio(e.target.value)}
                                style={{
                                    width: "100%",
                                    minHeight: "100px",
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: "8px",
                                    padding: "0.75rem",
                                    marginBottom: "1rem"
                                }}
                            />
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        backgroundColor: primaryColor,
                                        color: "white",
                                        border: "none",
                                        borderRadius: "20px",
                                        padding: "8px 16px",
                                        cursor: "pointer"
                                    }}
                                    onClick={handleSaveBio}
                                >
                                    Guardar
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: textColor,
                                        border: `1px solid ${lightTextColor}`,
                                        borderRadius: "20px",
                                        padding: "8px 16px",
                                        cursor: "pointer"
                                    }}
                                    onClick={handleCancelEdit}
                                >
                                    Cancelar
                                </motion.button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                marginBottom: "0.25rem",
                                color: textColor
                            }}>{name}</h1>
                            <div style={{
                                color: lightTextColor,
                                marginBottom: "1rem"
                            }}>@{userUsername}</div>
                            <p style={{
                                marginBottom: "1rem",
                                color: textColor
                            }}>{bio}</p>
                        </>
                    )}
                </div>

                {/* Pestañas de contenido */}
                <div style={{
                    display: "flex",
                    borderBottom: `1px solid ${borderColor}`,
                    backgroundColor: cardColor
                }}>
                    <motion.button
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        style={{
                            flex: 1,
                            padding: "1rem",
                            border: "none",
                            backgroundColor: selectedContent === "publicaciones" ? "rgba(255, 69, 0, 0.1)" : "transparent",
                            color: selectedContent === "publicaciones" ? accentColor : textColor,
                            fontWeight: "bold",
                            cursor: "pointer",
                            borderBottom: selectedContent === "publicaciones" ? `2px solid ${accentColor}` : "none"
                        }}
                        onClick={() => setSelectedContent("publicaciones")}
                    >
                        Publicaciones
                    </motion.button>
                    <motion.button
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ backgroundColor: "rgba(255,255,white,0.1)" }}
                        style={{
                            flex: 1,
                            padding: "1rem",
                            border: "none",
                            backgroundColor: selectedContent === "eventos" ? "rgba(255, 69, 0, 0.1)" : "transparent",
                            color: selectedContent === "eventos" ? accentColor : textColor,
                            fontWeight: "bold",
                            cursor: "pointer",
                            borderBottom: selectedContent === "eventos" ? `2px solid ${accentColor}` : "none"
                        }}
                        onClick={() => setSelectedContent("eventos")}
                    >
                        Eventos
                    </motion.button>
                </div>

                {/* Contenido según pestaña seleccionada */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {selectedContent === "publicaciones" && (
                        <div>
                            {profilePosts.length > 0 ? (
                                profilePosts.map(post => (
                                    <div key={post.id} style={{
                                        padding: "1rem",
                                        borderBottom: `1px solid ${borderColor}`,
                                        backgroundColor: cardColor
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
                                                flexShrink: 0,
                                                overflow: "hidden"
                                            }}>
                                                <img
                                                    src={profileImage}
                                                    alt="Perfil"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.25rem"
                                                }}>
                                                    <span style={{
                                                        fontWeight: "bold",
                                                        marginRight: "0.25rem",
                                                        color: textColor
                                                    }}>{name}</span>
                                                    <span style={{
                                                        marginRight: "0.25rem",
                                                        color: lightTextColor
                                                    }}>@{userUsername}</span>
                                                    <span style={{ color: lightTextColor }}>· {post.time}</span>
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    padding: "2rem",
                                    textAlign: "center",
                                    color: lightTextColor
                                }}>
                                    <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>No hay publicaciones aún</div>
                                    <div>Cuando publiques algo, aparecerá aquí</div>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedContent === "eventos" && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: "1.5rem",
                            padding: "1.5rem"
                        }}>
                            {[...events.paraTi, ...events.comunidad].map(event => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{
                                        y: -5,
                                        boxShadow: `0 10px 25px rgba(255, 69, 0, 0.3)`,
                                        borderColor: primaryColor
                                    }}
                                    style={{
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        border: `2px solid ${borderColor}`,
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        position: "relative",
                                        transition: "all 0.1s ease",
                                        height: "280px",
                                        minWidth: "320px",
                                        background: "linear-gradient(135deg, rgba(30,30,30,0.9), rgba(18,18,18,1))"
                                    }}
                                >
                                    {/* Overlay oscuro */}
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(0,0,0,0.6)",
                                        zIndex: 1
                                    }}></div>

                                    {/* Contenido del evento */}
                                    <div style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        padding: "1rem",
                                        zIndex: 3
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            height: "100%"
                                        }}>
                                            {/* Equipo local */}
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flex: 1
                                            }}>
                                                <div style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "50%",
                                                    overflow: "hidden",
                                                    border: `3px solid ${primaryColor}`,
                                                    boxShadow: `0 0 15px rgba(255, 69, 0, 0.3)`,
                                                    position: "relative"
                                                }}>
                                                    <img
                                                        src={event.localImage}
                                                        alt={event.localTeam}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                </div>
                                                <div style={{
                                                    marginTop: "1rem",
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    color: textColor,
                                                    fontSize: "1.1rem"
                                                }}>
                                                    {event.localTeam}
                                                </div>
                                            </div>

                                            {/* VS */}
                                            <div style={{
                                                fontSize: "1.8rem",
                                                fontWeight: "bold",
                                                color: primaryColor,
                                                padding: "0 1rem",
                                                textShadow: `0 0 10px rgba(255, 69, 0, 0.5)`,
                                                margin: "0 0.5rem"
                                            }}>
                                                VS
                                            </div>

                                            {/* Equipo visitante */}
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flex: 1
                                            }}>
                                                <div style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "50%",
                                                    overflow: "hidden",
                                                    border: `3px solid ${primaryColor}`,
                                                    boxShadow: `0 0 15px rgba(255, 69, 0, 0.3)`,
                                                    position: "relative"
                                                }}>
                                                    <img
                                                        src={event.visitorImage}
                                                        alt={event.visitorTeam}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                </div>
                                                <div style={{
                                                    marginTop: "1rem",
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    color: textColor,
                                                    fontSize: "1.1rem"
                                                }}>
                                                    {event.visitorTeam}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Icono del deporte */}
                                        <div style={{
                                            position: "absolute",
                                            top: "15px",
                                            right: "15px",
                                            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                                            color: "white",
                                            padding: "0.5rem",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: `0 2px 10px rgba(255, 69, 0, 0.5)`,
                                            zIndex: 3
                                        }}>
                                            <SportIcon sport={event.sport} style={{
                                                width: "25px",
                                                height: "25px",
                                                color: "white"
                                            }} />
                                        </div>
                                    </div>

                                    {/* Pie de tarjeta con información */}
                                    <div style={{
                                        padding: "1rem",
                                        background: "rgba(30,30,30,0.9)",
                                        borderTop: `1px solid ${borderColor}`,
                                        position: "relative",
                                        zIndex: 3,
                                        minHeight: "100px"
                                    }}>
                                        {/* Indicador de miembro */}
                                        {event.isMember && (
                                            <div style={{
                                                position: "absolute",
                                                top: "-12px",
                                                left: "15px",
                                                background: primaryColor,
                                                color: "white",
                                                padding: "3px 10px",
                                                borderRadius: "20px",
                                                fontSize: "0.7rem",
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
                                                </svg>
                                                Mi equipo
                                            </div>
                                        )}

                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: event.isMember ? "0.5rem" : "0"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                color: lightTextColor,
                                                fontSize: "0.9rem"
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
                                                    <g fill="none" stroke="#a0a0a0" strokeWidth="4">
                                                        <circle cx="24" cy="8" r="4" fill=""></circle>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M7 18H19V34"
                                                        ></path>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M41 18H29V44"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                {event.sport.charAt(0).toUpperCase() + event.sport.slice(1)}
                                            </div>

                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                color: lightTextColor,
                                                fontSize: "0.9rem"
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
                                                    <path d="M12 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill={lightTextColor} />
                                                </svg>
                                                {new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div style={{
                                            marginTop: "0.5rem",
                                            color: textColor,
                                            fontWeight: "500",
                                            fontSize: "0.95rem",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={primaryColor} />
                                            </svg>
                                            {event.location}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
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
                        cursor: "pointer"
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

export default PantallaPerfil;