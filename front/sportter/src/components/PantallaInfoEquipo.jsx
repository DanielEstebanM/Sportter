import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

function PantallaInfoEquipo() {
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddMembersModal, setShowAddMembersModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null);
    const [showMemberOptions, setShowMemberOptions] = useState(null);
    const [searchMemberQuery, setSearchMemberQuery] = useState("");
    const [availableMembers, setAvailableMembers] = useState([
        { id: 4, name: "Usuario4", email: "usuario4@example.com" },
        { id: 5, name: "Usuario5", email: "usuario5@example.com" },
        { id: 6, name: "Usuario6", email: "usuario6@example.com" },
    ]);
    
    // Estados para editar equipo
    const [teamImage, setTeamImage] = useState(null);
    const [teamImagePreview, setTeamImagePreview] = useState("");
    const [teamName, setTeamName] = useState("");
    const [teamSport, setTeamSport] = useState("fútbol");
    const [teamDescription, setTeamDescription] = useState("");
    const [showSportsMenu, setShowSportsMenu] = useState(false);
    
    // Estados para crear evento
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [opponentTeam, setOpponentTeam] = useState("");
    const [opponentImage, setOpponentImage] = useState("");
    
    const location = useLocation();
    const navigate = useNavigate();
    const teamData = location.state?.team || {
        id: 1,
        name: "Los Tigres",
        sport: "fútbol",
        members: 12,
        image: "https://images2.minutemediacdn.com/image/upload/c_crop,w_3531,h_1986,x_0,y_232/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_es_international_web/01j5c0e6nzzxe7vxjnzk.jpg",
        description: "Equipo de fútbol amateur con sede en Madrid. Jugamos los fines de semana y participamos en torneos locales.",
        membersList: [
            { id: 1, name: "Usuario1", email: "usuario1@example.com", isAdmin: true },
            { id: 2, name: "Usuario2", email: "usuario2@example.com", isAdmin: false },
            { id: 3, name: "Usuario3", email: "usuario3@example.com", isAdmin: false },
        ],
        isAdmin: true
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
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

        return icons[sport] || icons["fútbol"];
    };

    // Formatear fecha para mostrarla
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

    // Manejar cambios de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTeamImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeamImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setTeamImage(null);
        setTeamImagePreview("");
    };

    // Manejar añadir miembros
    const handleAddMember = (member) => {
        if (teamData.membersList.length < 30) {
            const updatedTeam = {
                ...teamData,
                membersList: [...teamData.membersList, { ...member, isAdmin: false }],
                members: teamData.members + 1
            };
            // Aquí iría la lógica para actualizar el equipo en el estado global o backend
            navigate('/equipos', { state: { team: updatedTeam } });
        }
    };

    const handleRemoveMember = (memberId) => {
        const updatedTeam = {
            ...teamData,
            membersList: teamData.membersList.filter(m => m.id !== memberId),
            members: teamData.members - 1
        };
        // Aquí iría la lógica para actualizar el equipo en el estado global o backend
        navigate('/equipos', { state: { team: updatedTeam } });
        setShowMemberOptions(null);
    };

    // Manejar acciones de grupo
    const handleLeaveTeam = () => {
        if (teamData.isAdmin && teamData.membersList.length > 1) {
            // Transferir admin a otro miembro si el admin se va
            const newAdmin = teamData.membersList.find(m => !m.isAdmin);
            if (newAdmin) {
                const updatedTeam = {
                    ...teamData,
                    membersList: teamData.membersList
                        .filter(m => m.id !== userData.id)
                        .map(m => m.id === newAdmin.id ? { ...m, isAdmin: true } : m),
                    members: teamData.members - 1
                };
                // Actualizar equipo
                navigate('/equipos', { state: { team: updatedTeam } });
            }
        } else {
            // Eliminar equipo si no quedan miembros
            if (teamData.members === 1) {
                // Eliminar equipo completamente
                navigate('/equipos');
            } else {
                // Solo remover al usuario
                const updatedTeam = {
                    ...teamData,
                    membersList: teamData.membersList.filter(m => m.id !== userData.id),
                    members: teamData.members - 1
                };
                navigate('/equipos', { state: { team: updatedTeam } });
            }
        }
        setShowConfirmationModal(false);
    };

    const handleDeleteTeam = () => {
        // Eliminar equipo completamente
        navigate('/equipos');
        setShowConfirmationModal(false);
    };

    // Manejar creación de evento
    const handleCreateEvent = () => {
        const newEvent = {
            id: Date.now(),
            localTeam: teamData.name,
            visitorTeam: opponentTeam,
            sport: teamData.sport,
            localImage: teamData.image,
            visitorImage: opponentImage || "https://i.imgur.com/bUwYQP3.png",
            date: `${eventDate}T${eventTime}:00`,
            location: eventLocation,
            isMember: true
        };
        
        // Aquí iría la lógica para añadir el evento al estado global o backend
        // Por ahora simulamos que se añade a la pantalla de eventos
        navigate('/eventos', { state: { newEvent } });
        setShowCreateEventModal(false);
    };

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

    // Inicializar datos del equipo al cargar
    useEffect(() => {
        if (teamData) {
            setTeamName(teamData.name);
            setTeamSport(teamData.sport);
            setTeamDescription(teamData.description);
            setTeamImagePreview(teamData.image);
        }
    }, [teamData]);

    const handleLogout = () => {
        navigate('/');
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
            {/* Barra lateral izquierda (igual que en PantallaPrincipal) */}
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
                            color: textColor,
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "1.2rem",
                            textAlign: "left",
                            padding: "0.5rem",
                        }}
                        onClick={() => {
                            navigate('/principal', { state: { user: userData } });
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
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
                            color: textColor,
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "1.2rem",
                            textAlign: "left",
                            padding: "0.5rem"
                        }}
                        onClick={() => {
                            navigate('/equipos', { state: { user: userEmail } });
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
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
                            color: textColor,
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "1.2rem",
                            textAlign: "left",
                            padding: "0.5rem"
                        }}
                        onClick={() => {
                            navigate('/eventos', { state: { user: userEmail } });
                            isMobile && setShowLeftSidebar(false);
                        }}
                    >
                        <motion.div
                            style={{ marginBottom: "0.20rem" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
                                <path d="M16 10H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1m3-7h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-1 16H6c-.55 0-1-.45-1-1V8h14v10c0 .55-.45 1-1 1m-5-5H8c-.55 0-1 .45-1 1s.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1" fill={textColor} />
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
                            color: textColor,
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "1.2rem",
                            textAlign: "left",
                            padding: "0.5rem",
                            borderRadius: "8px"
                        }}
                        onClick={() => {
                            navigate('/mensajes', { state: { user: userEmail } });
                            isMobile && setShowLeftSidebar(false);
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
                            color: textColor,
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "1.2rem",
                            textAlign: "left",
                            padding: "0.5rem"
                        }}
                        onClick={() => {
                            navigate('/perfil', { state: { user: userEmail } });
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
                height: "100vh",
                overflowY: "auto"
            }}>
                {/* Encabezado */}
                <div style={{
                    padding: "1rem",
                    borderBottom: `1px solid ${borderColor}`,
                    backgroundColor: cardColor,
                    position: "sticky",
                    top: 0,
                    zIndex: 20
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <h1 style={{
                            fontSize: "1.8rem",
                            fontWeight: "bold",
                            margin: "0.5rem 0",
                            color: primaryColor,
                            textAlign: isMobile ? "center" : "left",
                        }}>{teamData.name}</h1>
                        
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: textColor,
                                    cursor: "pointer",
                                    padding: "0.5rem",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onClick={() => {
                                    // Lógica para mensajes (a implementar)
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill={textColor} />
                                </svg>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: textColor,
                                    cursor: "pointer",
                                    padding: "0.5rem",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onClick={() => {
                                    // Menú de opciones
                                    setShowMemberOptions(showMemberOptions ? null : "options");
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill={textColor} />
                                </svg>
                            </motion.button>
                            
                            {showMemberOptions && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "70px",
                                        backgroundColor: cardColor,
                                        borderRadius: "8px",
                                        border: `1px solid ${borderColor}`,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                        zIndex: 30,
                                        minWidth: "200px",
                                        overflow: "hidden"
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setShowEditModal(true);
                                            setShowMemberOptions(null);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 1rem",
                                            textAlign: "left",
                                            background: "transparent",
                                            border: "none",
                                            color: textColor,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            ":hover": {
                                                backgroundColor: "rgba(255,255,255,0.1)"
                                            }
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill={textColor} />
                                        </svg>
                                        Editar grupo
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setShowAddMembersModal(true);
                                            setShowMemberOptions(null);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 1rem",
                                            textAlign: "left",
                                            background: "transparent",
                                            border: "none",
                                            color: textColor,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            ":hover": {
                                                backgroundColor: "rgba(255,255,255,0.1)"
                                            }
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM6 12C6 9.79 7.79 8 10 8C10.55 8 11 8.45 11 9C11 9.55 10.55 10 10 10C8.9 10 8 10.9 8 12C8 13.1 8.9 14 10 14C10.55 14 11 14.45 11 15C11 15.55 10.55 16 10 16C7.79 16 6 14.21 6 12Z" fill={textColor} />
                                        </svg>
                                        Añadir miembros
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setShowCreateEventModal(true);
                                            setShowMemberOptions(null);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 1rem",
                                            textAlign: "left",
                                            background: "transparent",
                                            border: "none",
                                            color: textColor,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            ":hover": {
                                                backgroundColor: "rgba(255,255,255,0.1)"
                                            }
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill={textColor} />
                                            <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill={textColor} />
                                        </svg>
                                        Crear evento
                                    </button>
                                    
                                    <div style={{ borderTop: `1px solid ${borderColor}` }}></div>
                                    
                                    <button
                                        onClick={() => {
                                            setConfirmationAction("leave");
                                            setShowConfirmationModal(true);
                                            setShowMemberOptions(null);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 1rem",
                                            textAlign: "left",
                                            background: "transparent",
                                            border: "none",
                                            color: textColor,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            ":hover": {
                                                backgroundColor: "rgba(255,255,255,0.1)"
                                            }
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill={textColor} />
                                        </svg>
                                        Salir del grupo
                                    </button>
                                    
                                    {teamData.isAdmin && (
                                        <button
                                            onClick={() => {
                                                setConfirmationAction("delete");
                                                setShowConfirmationModal(true);
                                                setShowMemberOptions(null);
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem",
                                                textAlign: "left",
                                                background: "transparent",
                                                border: "none",
                                                color: "#ff4d4f",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                ":hover": {
                                                    backgroundColor: "rgba(255,255,255,0.1)"
                                                }
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#ff4d4f" />
                                            </svg>
                                            Borrar grupo
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contenido del equipo */}
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    padding: "1.5rem",
                    gap: "1.5rem"
                }}>
                    {/* Columna izquierda - Foto y miembros */}
                    <div style={{
                        flex: isMobile ? "1" : "0 0 300px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem"
                    }}>
                        {/* Foto de perfil del equipo */}
                        <div style={{
                            backgroundColor: cardColor,
                            borderRadius: "12px",
                            padding: "1rem",
                            border: `1px solid ${borderColor}`,
                            position: "relative"
                        }}>
                            <div style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                borderRadius: "8px",
                                overflow: "hidden",
                                position: "relative",
                                backgroundColor: "rgba(255,255,255,0.05)"
                            }}>
                                <img
                                    src={teamData.image}
                                    alt={teamData.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Miembros del equipo */}
                        <div style={{
                            backgroundColor: cardColor,
                            borderRadius: "12px",
                            padding: "1rem",
                            border: `1px solid ${borderColor}`
                        }}>
                            <h3 style={{
                                margin: "0 0 1rem 0",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: textColor,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 7a7 7 0 1 0 14 0A7 7 0 1 0 0 7" fill={textColor} />
                                </svg>
                                Miembros ({teamData.members})
                            </h3>
                            
                            <div style={{
                                maxHeight: "300px",
                                overflowY: "auto",
                                scrollbarWidth: "thin",
                                scrollbarColor: `${lightTextColor} ${cardColor}`,
                                '&::-webkit-scrollbar': {
                                    width: "6px"
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
                                {teamData.membersList.map(member => (
                                    <div key={member.id} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "0.75rem 0.5rem",
                                        borderBottom: `1px solid ${borderColor}`,
                                        position: "relative",
                                        ":last-child": {
                                            borderBottom: "none"
                                        }
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem"
                                        }}>
                                            <div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: primaryColor,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontWeight: "bold",
                                                flexShrink: 0
                                            }}>
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontWeight: "500",
                                                    color: textColor
                                                }}>
                                                    {member.name}
                                                    {member.isAdmin && (
                                                        <span style={{
                                                            marginLeft: "0.5rem",
                                                            fontSize: "0.7rem",
                                                            background: primaryColor,
                                                            color: "white",
                                                            padding: "0.1rem 0.4rem",
                                                            borderRadius: "4px"
                                                        }}>
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{
                                                    fontSize: "0.8rem",
                                                    color: lightTextColor,
                                                    marginTop: "0.1rem"
                                                }}>
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {(teamData.isAdmin && !member.isAdmin) && (
                                            <button
                                                onClick={() => setShowMemberOptions(member.id)}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    color: lightTextColor,
                                                    cursor: "pointer",
                                                    padding: "0.25rem",
                                                    borderRadius: "4px",
                                                    ":hover": {
                                                        backgroundColor: "rgba(255,255,255,0.1)"
                                                    }
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill={lightTextColor} />
                                                </svg>
                                            </button>
                                        )}
                                        
                                        {showMemberOptions === member.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                    position: "absolute",
                                                    right: "0",
                                                    top: "50px",
                                                    backgroundColor: cardColor,
                                                    borderRadius: "8px",
                                                    border: `1px solid ${borderColor}`,
                                                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                                    zIndex: 10,
                                                    minWidth: "150px",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setShowMemberOptions(null);
                                                        // Lógica para ver perfil (a implementar)
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem 1rem",
                                                        textAlign: "left",
                                                        background: "transparent",
                                                        border: "none",
                                                        color: textColor,
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem",
                                                        ":hover": {
                                                            backgroundColor: "rgba(255,255,255,0.1)"
                                                        }
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill={textColor} />
                                                    </svg>
                                                    Ver perfil
                                                </button>
                                                
                                                {teamData.isAdmin && (
                                                    <button
                                                        onClick={() => {
                                                            setConfirmationAction("remove");
                                                            setShowConfirmationModal(true);
                                                            setShowMemberOptions(null);
                                                        }}
                                                        style={{
                                                            width: "100%",
                                                            padding: "0.75rem 1rem",
                                                            textAlign: "left",
                                                            background: "transparent",
                                                            border: "none",
                                                            color: "#ff4d4f",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.5rem",
                                                            ":hover": {
                                                                backgroundColor: "rgba(255,255,255,0.1)"
                                                            }
                                                        }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#ff4d4f" />
                                                        </svg>
                                                        Eliminar
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Nombre y detalles */}
                    <div style={{
                        flex: 1,
                        backgroundColor: cardColor,
                        borderRadius: "12px",
                        padding: "1.5rem",
                        border: `1px solid ${borderColor}`
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "1.5rem"
                        }}>
                            <div>
                                <h2 style={{
                                    margin: "0",
                                    fontSize: "1.8rem",
                                    fontWeight: "bold",
                                    color: textColor
                                }}>
                                    {teamData.name}
                                </h2>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    marginTop: "0.5rem"
                                }}>
                                    <SportIcon sport={teamData.sport} style={{
                                        width: "20px",
                                        height: "20px",
                                        color: primaryColor
                                    }} />
                                    <span style={{
                                        color: lightTextColor,
                                        fontSize: "1rem"
                                    }}>
                                        {teamData.sport.charAt(0).toUpperCase() + teamData.sport.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detalles del equipo */}
                        <div>
                            <h3 style={{
                                margin: "0 0 1rem 0",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: textColor,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill={textColor} />
                                </svg>
                                Detalles
                            </h3>
                            
                            <p style={{
                                color: textColor,
                                lineHeight: "1.6",
                                margin: "0 0 1.5rem 0",
                                whiteSpace: "pre-line"
                            }}>
                                {teamData.description || "No hay descripción disponible."}
                            </p>
                        </div>

                        {/* Próximos eventos (opcional) */}
                        <div>
                            <h3 style={{
                                margin: "0 0 1rem 0",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: textColor,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill={textColor} />
                                </svg>
                                Próximos eventos
                            </h3>
                            
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem"
                            }}>
                                {/* Ejemplo de evento */}
                                <div style={{
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    border: `1px solid ${borderColor}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <div>
                                        <div style={{
                                            fontWeight: "bold",
                                            color: textColor,
                                            marginBottom: "0.25rem"
                                        }}>
                                            {teamData.name} vs. Rival
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            color: lightTextColor,
                                            fontSize: "0.9rem"
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill={lightTextColor} />
                                            </svg>
                                            15 Dic 2023, 20:00
                                        </div>
                                    </div>
                                    <button
                                        style={{
                                            background: "transparent",
                                            border: `1px solid ${primaryColor}`,
                                            color: primaryColor,
                                            borderRadius: "4px",
                                            padding: "0.5rem 1rem",
                                            cursor: "pointer",
                                            fontWeight: "500",
                                            ":hover": {
                                                background: "rgba(255, 69, 0, 0.1)"
                                            }
                                        }}
                                    >
                                        Ver
                                    </button>
                                </div>
                                
                                <div style={{
                                    textAlign: "center",
                                    padding: "1rem",
                                    color: lightTextColor
                                }}>
                                    No hay más eventos programados
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para editar equipo */}
            {showEditModal && (
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
                            maxWidth: "500px",
                            border: `1px solid ${borderColor}`,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: `${lightTextColor} ${cardColor}`
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ margin: 0, color: textColor }}>Editar equipo</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
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

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Imagen del equipo</label>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                marginBottom: "1rem"
                            }}>
                                <div style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    position: "relative",
                                    backgroundColor: "rgba(255,255,255,0.05)"
                                }}>
                                    <img
                                        src={teamImagePreview || teamData.image}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                    <label style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        cursor: "pointer",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                        ":hover": {
                                            opacity: 1
                                        }
                                    }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="white" />
                                        </svg>
                                    </label>
                                </div>
                            </div>
                            {teamImagePreview && (
                                <button
                                    onClick={handleRemoveImage}
                                    style={{
                                        background: "transparent",
                                        border: `1px solid ${primaryColor}`,
                                        color: primaryColor,
                                        borderRadius: "4px",
                                        padding: "0.5rem 1rem",
                                        cursor: "pointer",
                                        display: "block",
                                        margin: "0 auto",
                                        ":hover": {
                                            background: "rgba(255, 69, 0, 0.1)"
                                        }
                                    }}
                                >
                                    Eliminar imagen
                                </button>
                            )}
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Nombre del equipo</label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                maxLength={50}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Deporte</label>
                            <div style={{ position: "relative" }}>
                                <button
                                    onClick={() => setShowSportsMenu(!showSportsMenu)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: "8px",
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        cursor: "pointer"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <SportIcon sport={teamSport} style={{ width: "20px", height: "20px", marginRight: "0.5rem" }} />
                                        {teamSport.charAt(0).toUpperCase() + teamSport.slice(1)}
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 10L12 15L17 10H7Z" fill={textColor} />
                                    </svg>
                                </button>

                                {showSportsMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            right: 0,
                                            backgroundColor: cardColor,
                                            borderRadius: "8px",
                                            border: `1px solid ${borderColor}`,
                                            zIndex: 10,
                                            marginTop: "0.25rem",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {["fútbol", "baloncesto", "volleyball", "tenis", "ciclismo"].map((sport) => (
                                            <button
                                                key={sport}
                                                onClick={() => {
                                                    setTeamSport(sport);
                                                    setShowSportsMenu(false);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    textAlign: "left",
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    color: textColor,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    ":hover": {
                                                        backgroundColor: "rgba(255,255,255,0.1)"
                                                    }
                                                }}
                                            >
                                                <SportIcon sport={sport} style={{ width: "20px", height: "20px", marginRight: "0.5rem" }} />
                                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Descripción</label>
                            <textarea
                                value={teamDescription}
                                onChange={(e) => setTeamDescription(e.target.value)}
                                rows="4"
                                maxLength={500}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none",
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "1.5rem",
                            gap: "0.5rem"
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowEditModal(false)}
                                style={{
                                    background: "transparent",
                                    color: textColor,
                                    borderRadius: "30px",
                                    border: `1px solid ${borderColor}`,
                                    padding: "8px 24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    // Aquí iría la lógica para guardar los cambios
                                    const updatedTeam = {
                                        ...teamData,
                                        name: teamName,
                                        sport: teamSport,
                                        description: teamDescription,
                                        image: teamImagePreview || teamData.image
                                    };
                                    // Actualizar el equipo
                                    navigate('/equipos', { state: { team: updatedTeam } });
                                    setShowEditModal(false);
                                }}
                                style={{
                                    background: primaryColor,
                                    color: "white",
                                    borderRadius: "30px",
                                    border: "none",
                                    padding: "8px 24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                Guardar cambios
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal para añadir miembros */}
            {showAddMembersModal && (
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
                            maxWidth: "500px",
                            border: `1px solid ${borderColor}`,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: `${lightTextColor} ${cardColor}`
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ margin: 0, color: textColor }}>Añadir miembros</h3>
                            <button
                                onClick={() => setShowAddMembersModal(false)}
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

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Buscar usuarios</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o email..."
                                    value={searchMemberQuery}
                                    onChange={(e) => setSearchMemberQuery(e.target.value)}
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

                        <div style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            marginBottom: "1.5rem",
                            scrollbarWidth: "thin",
                            scrollbarColor: `${lightTextColor} ${cardColor}`
                        }}>
                            {availableMembers
                                .filter(member => 
                                    member.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) || 
                                    member.email.toLowerCase().includes(searchMemberQuery.toLowerCase())
                                )
                                .filter(member => !teamData.membersList.some(m => m.id === member.id))
                                .map(member => (
                                    <div key={member.id} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "0.75rem",
                                        borderBottom: `1px solid ${borderColor}`,
                                        ":last-child": {
                                            borderBottom: "none"
                                        }
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: primaryColor,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontWeight: "bold",
                                                flexShrink: 0
                                            }}>
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: "500", color: textColor }}>{member.name}</div>
                                                <div style={{ fontSize: "0.8rem", color: lightTextColor }}>{member.email}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddMember(member)}
                                            disabled={teamData.members >= 30}
                                            style={{
                                                background: teamData.members >= 30 ? "rgba(255, 112, 67, 0.5)" : primaryColor,
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                padding: "0.5rem 1rem",
                                                cursor: teamData.members >= 30 ? "not-allowed" : "pointer",
                                                fontSize: "0.8rem",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {teamData.members >= 30 ? "Límite alcanzado" : "Añadir"}
                                        </button>
                                    </div>
                                ))}
                            
                            {availableMembers.filter(member => 
                                member.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) || 
                                member.email.toLowerCase().includes(searchMemberQuery.toLowerCase())
                            ).filter(member => !teamData.membersList.some(m => m.id === member.id)).length === 0 && (
                                <div style={{ textAlign: "center", padding: "1rem", color: lightTextColor }}>
                                    {searchMemberQuery ? "No se encontraron resultados" : "No hay usuarios disponibles para añadir"}
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "1rem"
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAddMembersModal(false)}
                                style={{
                                    background: "transparent",
                                    color: textColor,
                                    borderRadius: "30px",
                                    border: `1px solid ${borderColor}`,
                                    padding: "8px 24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                Cerrar
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal para crear evento */}
            {showCreateEventModal && (
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
                            maxWidth: "500px",
                            border: `1px solid ${borderColor}`,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: `${lightTextColor} ${cardColor}`
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ margin: 0, color: textColor }}>Crear nuevo evento</h3>
                            <button
                                onClick={() => setShowCreateEventModal(false)}
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

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Equipo rival</label>
                            <input
                                type="text"
                                value={opponentTeam}
                                onChange={(e) => setOpponentTeam(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none"
                                }}
                                placeholder="Nombre del equipo rival"
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Fecha</label>
                            <input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Hora</label>
                            <input
                                type="time"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Ubicación</label>
                            <input
                                type="text"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none"
                                }}
                                placeholder="Dirección o nombre del lugar"
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: textColor }}>Imagen del equipo rival (opcional)</label>
                            <input
                                type="text"
                                value={opponentImage}
                                onChange={(e) => setOpponentImage(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                    outline: "none"
                                }}
                                placeholder="URL de la imagen"
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "1.5rem",
                            gap: "0.5rem"
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateEventModal(false)}
                                style={{
                                    background: "transparent",
                                    color: textColor,
                                    borderRadius: "30px",
                                    border: `1px solid ${borderColor}`,
                                    padding: "8px 24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateEvent}
                                disabled={!opponentTeam || !eventDate || !eventTime || !eventLocation}
                                style={{
                                    background: (!opponentTeam || !eventDate || !eventTime || !eventLocation) ? "rgba(255, 69, 0, 0.5)" : primaryColor,
                                    color: "white",
                                    borderRadius: "30px",
                                    border: "none",
                                    padding: "8px 24px",
                                    cursor: (!opponentTeam || !eventDate || !eventTime || !eventLocation) ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                Crear evento
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal de confirmación */}
            {showConfirmationModal && (
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
                            maxWidth: "400px",
                            border: `1px solid ${borderColor}`,
                            textAlign: "center"
                        }}
                    >
                        <h3 style={{ margin: "0 0 1rem 0", color: textColor }}>
                            {confirmationAction === "leave" ? "¿Salir del grupo?" : 
                             confirmationAction === "delete" ? "¿Borrar el grupo?" : 
                             "¿Eliminar a este miembro?"}
                        </h3>
                        
                        <p style={{ color: lightTextColor, marginBottom: "1.5rem" }}>
                            {confirmationAction === "leave" ? "¿Estás seguro de que quieres salir de este grupo?" : 
                             confirmationAction === "delete" ? "Esta acción eliminará el grupo permanentemente. ¿Estás seguro?" : 
                             "¿Estás seguro de que quieres eliminar a este miembro del grupo?"}
                        </p>
                        
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem"
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowConfirmationModal(false)}
                                style={{
                                    background: "transparent",
                                    color: textColor,
                                    borderRadius: "30px",
                                    border: `1px solid ${borderColor}`,
                                    padding: "8px 24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (confirmationAction === "leave") {
                                        handleLeaveTeam();
                                    } else if (confirmationAction === "delete") {
                                        handleDeleteTeam();
                                    } else if (confirmationAction === "remove") {
                                        // Lógica para eliminar miembro
                                        handleRemoveMember(showMemberOptions);
                                        setShowConfirmationModal(false);
                                    }
                                }}
                                style={{
                                    background: confirmationAction === "delete" || confirmationAction === "remove" ? "#ff4d4f" : primaryColor,
                                    color: "white",
                                    borderRadius: "30px",
                                    border: "none",
                                    padding: "8px 24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                            >
                                {confirmationAction === "leave" ? "Salir" : 
                                 confirmationAction === "delete" ? "Borrar" : 
                                 "Eliminar"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

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

export default PantallaInfoEquipo;