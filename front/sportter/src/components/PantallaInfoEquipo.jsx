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
        { id: 7, name: "Usuario7", email: "usuario7@example.com" },
        { id: 8, name: "Usuario8", email: "usuario8@example.com" },
        { id: 9, name: "Usuario9", email: "usuario9@example.com" },
        { id: 10, name: "Usuario10", email: "usuario10@example.com" },
        { id: 11, name: "Usuario11", email: "usuario11@example.com" },
        { id: 12, name: "Usuario12", email: "usuario12@example.com" },
    ]);
    const [showTeamSearchModal, setShowTeamSearchModal] = useState(false);
    const [teams, setTeams] = useState([
        { id: 1, name: "Los Leones", image: "https://i.imgur.com/abc123.jpg" },
        { id: 2, name: "Águilas FC", image: "https://i.imgur.com/def456.jpg" },
        { id: 3, name: "Tiburones", image: "https://i.imgur.com/ghi789.jpg" },
    ]);
    const [searchTeamQuery, setSearchTeamQuery] = useState("");

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
        members: 15,
        image: "https://images2.minutemediacdn.com/image/upload/c_crop,w_3531,h_1986,x_0,y_232/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_es_international_web/01j5c0e6nzzxe7vxjnzk.jpg",
        description: "Equipo de fútbol amateur con sede en Madrid.",
        membersList: [
            { id: 1, name: "Usuario1", email: "usuario1@example.com", isAdmin: true },
            { id: 2, name: "Usuario2", email: "usuario2@example.com", isAdmin: false },
            { id: 3, name: "Usuario3", email: "usuario3@example.com", isAdmin: false },
            { id: 4, name: "Usuario4", email: "usuario4@example.com" },
            { id: 5, name: "Usuario5", email: "usuario5@example.com" },
            { id: 6, name: "Usuario6", email: "usuario6@example.com" },
            { id: 7, name: "Usuario7", email: "usuario7@example.com" },
            { id: 8, name: "Usuario8", email: "usuario8@example.com" },
            { id: 9, name: "Usuario9", email: "usuario9@example.com" },
            { id: 10, name: "Usuario10", email: "usuario10@example.com" },
            { id: 11, name: "Usuario11", email: "usuario11@example.com" },
            { id: 12, name: "Usuario12", email: "usuario12@example.com" },
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

    const resetEventFields = () => {
        setEventDate("");
        setEventTime("");
        setEventLocation("");
        setOpponentTeam("");
        setOpponentImage("");
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
            navigate('/equipos', { state: { team: updatedTeam }, replace: true });
            setShowAddMembersModal(false);
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
        setShowConfirmationModal(false);
    };

    const handleLeaveTeam = () => {
        if (teamData.isAdmin && teamData.membersList.length > 1) {
            // Buscar un nuevo admin que no sea el usuario actual
            const newAdmin = teamData.membersList.find(m => !m.isAdmin && m.email !== userEmail);
            if (newAdmin) {
                const updatedTeam = {
                    ...teamData,
                    membersList: teamData.membersList
                        .filter(m => m.email !== userEmail)
                        .map(m => m.id === newAdmin.id ? { ...m, isAdmin: true } : m),
                    members: teamData.members - 1
                };
                navigate('/equipos', { state: { team: updatedTeam }, replace: true });
            }
        } else {
            if (teamData.members === 1) {
                // Eliminar equipo si era el último miembro
                navigate('/equipos', { replace: true });
            } else {
                // Solo remover al usuario
                const updatedTeam = {
                    ...teamData,
                    membersList: teamData.membersList.filter(m => m.email !== userEmail),
                    members: teamData.members - 1
                };
                navigate('/equipos', { state: { team: updatedTeam }, replace: true });
            }
        }
        setShowConfirmationModal(false);
    };

    const handleDeleteTeam = () => {
        const handleDeleteTeam = () => {
            // Aquí normalmente iría una llamada a la API para eliminar el equipo
            // Por ahora simulamos la eliminación navegando a la lista de equipos
            navigate('/equipos', { replace: true });
            setShowConfirmationModal(false);
        };;
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

    const handleSaveTeamChanges = () => {
        const updatedTeam = {
            ...teamData,
            name: teamName || teamData.name,
            sport: teamSport || teamData.sport,
            description: teamDescription || teamData.description,
            image: teamImagePreview || teamData.image
        };

        // Actualizar el estado local del equipo
        navigate('/equipos', { state: { team: updatedTeam }, replace: true });
        setShowEditModal(false);
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
    }, [teamData, showEditModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMemberOptions && !event.target.closest('.member-options')) {
                setShowMemberOptions(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMemberOptions]);

    const handleLogout = () => {
        // 1. Limpiar datos de autenticación
        localStorage.removeItem("userData");

        // 2. Redirigir al login (con replace para evitar volver atrás)
        navigate("/", { replace: true });
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
                    padding: "0.75rem",
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
                            width: isMobile ? "100%" : "auto"
                        }}>{teamData.name}</h1>
                    </div>
                </div>

                {/* Contenido del equipo */}
                <div style={{
                    padding: "1.5rem",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    {/* Sección superior con información del equipo */}
                    <div style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: "2rem",
                        marginBottom: "2rem"
                    }}>
                        {/* Foto del equipo */}
                        <div style={{
                            flex: "0 0 200px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <div style={{
                                width: "200px",
                                height: "200px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                position: "relative",
                                backgroundColor: "rgba(255,255,255,0.05)",
                                marginBottom: "1rem"
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

                        {/* Información del equipo */}
                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {/* Nombre y deporte */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                marginTop: "1rem",
                                flexWrap: "wrap"
                            }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    color: textColor
                                }}>
                                    {teamData.name}
                                </h2>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    backgroundColor: "rgba(255, 69, 0, 0.2)",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "20px"
                                }}>
                                    <SportIcon sport={teamData.sport} style={{
                                        width: "20px",
                                        height: "20px",
                                        color: primaryColor
                                    }} />
                                    <span style={{
                                        color: primaryColor,
                                        fontSize: "1rem",
                                        fontWeight: "500"
                                    }}>
                                        {teamData.sport.charAt(0).toUpperCase() + teamData.sport.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div style={{
                                marginBottom: "1.5rem"
                            }}>
                                <p style={{
                                    color: textColor,
                                    lineHeight: "1.6",
                                    margin: 0
                                }}>
                                    {teamData.description || "No hay descripción disponible."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Listado de miembros */}
                    <div>
                        <div style={{ margin: "-1rem 0 0.75rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{
                                fontSize: "1.25rem",
                                fontWeight: "bold",
                                marginBottom: "-0.5rem",
                                textAlign: isMobile ? "center" : "left",
                                color: lightTextColor
                            }}>
                                Miembros
                            </h3>

                            {/* Botones de acción */}
                            <div style={{
                                display: "flex",
                                gap: "1rem",
                                flexWrap: "wrap",
                                marginTop: "-1rem",
                                marginBottom: "0.5rem"
                            }}>
                                {/* Botón de Crear Evento */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowCreateEventModal(true)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        backgroundColor: primaryColor,
                                        color: "white",
                                        border: "none",
                                        borderRadius: "30px",
                                        padding: isMobile ? "0.5rem" : "0 1.5rem",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        fontSize: "1rem",
                                        width: isMobile ? "51px" : "auto",
                                        height: "50px",
                                        justifyContent: "center"
                                    }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2m0 14H3V5h18zm-5-7v2h-3v3h-2v-3H8v-2h3V7h2v3z" fill="white" />
                                    </svg>
                                    {!isMobile && "Crear Evento"}
                                </motion.button>

                                {/* Botón de Mensajes */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundColor: cardColor,
                                        border: `1px solid ${borderColor}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer"
                                    }}
                                >
                                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                            d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.616l-2.88 2.592C8.537 20.461 7 19.776 7 18.477V17H5a2 2 0 0 1-2-2zm4 2a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm-8 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm5 0a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2z"
                                            clipRule="evenodd" fill={textColor} />
                                    </svg>
                                </motion.button>

                                {/* Botón de Ajustes */}
                                <div style={{ position: "relative" }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            backgroundColor: cardColor,
                                            border: `1px solid ${borderColor}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setShowMemberOptions(showMemberOptions ? null : "options")}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083M12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9s-3.023 1.343-3.023 3s1.354 3 3.023 3"
                                                clipRule="evenodd" fill={textColor} />
                                        </svg>
                                    </motion.button>

                                    {showMemberOptions === "options" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -30, x: -130 }}
                                            animate={{ opacity: 1, y: 0, x: -130 }}
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: "60px",
                                                backgroundColor: cardColor,
                                                borderRadius: "8px",
                                                border: `1px solid ${borderColor}`,
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                                zIndex: 30,
                                                minWidth: "200px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <motion.button
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
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
                                                    gap: "0.9rem"
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "0.1rem" }}>
                                                    <path d="m410.3 231l11.3-11.3l-33.9-33.9l-62.1-62.1l-33.9-33.9l-11.3 11.3l-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5l-22.6 22.6l-11.4 11.3l33.9 33.9l62.1 62.1l33.9 33.9l11.3-11.3l22.6-22.6l14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6" fill={textColor} />
                                                </svg>
                                                Editar grupo
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
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
                                                    gap: "0.75rem"
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m-9-2V8c0-.55-.45-1-1-1s-1 .45-1 1v2H2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1zm9 4c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4" fill={textColor} />
                                                </svg>
                                                Añadir miembros
                                            </motion.button>

                                            <div style={{ borderTop: `1px solid ${borderColor}` }}></div>

                                            <motion.button
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
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
                                                    gap: "0.75rem"
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "0.1rem" }}>
                                                    <g fill="none">
                                                        <path
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            d="M10.138 1.815A3 3 0 0 1 14 4.688v14.624a3 3 0 0 1-3.862 2.873l-6-1.8A3 3 0 0 1 2 17.512V6.488a3 3 0 0 1 2.138-2.873zM15 4a1 1 0 0 1 1-1h3a3 3 0 0 1 3 3v1a1 1 0 1 1-2 0V6a1 1 0 0 0-1-1h-3a1 1 0 0 1-1-1m6 12a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-3a1 1 0 1 1 0-2h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1M9 11a1 1 0 1 0 0 2h.001a1 1 0 1 0 0-2z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M16 12h5m0 0l-2-2m2 2l-2 2"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                Salir del grupo
                                            </motion.button>

                                            {teamData.isAdmin && (
                                                <motion.button
                                                    whileHover={{ backgroundColor: "rgba(255, 35, 39, 0.19)" }}
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
                                                        gap: "0.85rem"
                                                    }}
                                                >
                                                    <svg width="14.5" height="15" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "0.15rem" }}>
                                                        <path d="M10.875 0a1 1 0 0 0-.594.281L5.562 5H3c-.551 0-1 .449-1 1v2c0 .551.449 1 1 1h.25l2.281 13.719v.062c.163.788.469 1.541 1.032 2.157A3.26 3.26 0 0 0 8.938 26h8.124a3.26 3.26 0 0 0 2.375-1.031c.571-.615.883-1.405 1.032-2.219v-.031L22.78 9H23c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1h-1.563l-2.812-3.5a.81.81 0 0 0-.719-.313a.8.8 0 0 0-.343.125L14.688 3.25L11.717.281A1 1 0 0 0 10.876 0zM11 2.438L13.563 5H8.436L11 2.437zm6.844.656L19.375 5h-2.938l-.593-.594zM5.25 9h.688l1.187 1.188l-1.438 1.406zm2.094 0h.937l-.469.469zm2.312 0h1.688l.906.906l-2 2l-1.75-1.75zm3.125 0h.344l-.156.188L12.78 9zm1.781 0h1.688l1.156 1.156l-1.75 1.75l-2-2.031zm3.063 0h.938l-.47.469L17.626 9zm2.344 0h.812l-.437 2.688l-1.532-1.532zm-7.032 1.594l2.032 2l-2.031 2l-2-2l2-2zm-5.124.281l1.718 1.719l-2 2l-1.625-1.625l-.031-.156zm10.28 0l2 2l-1.718 1.75l-2-2.031l1.719-1.719zm-7.843 2.438l2 2l-2 2l-2-2zm5.406 0l2.031 2l-2 2l-2.03-2zm4.188 1.25l-.219 1.312l-.563-.563l.782-.75zm-13.657.093l.657.656l-.469.47zM7.532 16l2 2l-2 2.031l-.562-.562l-.407-2.5zm5.407 0l2.03 2.031l-2 2L10.939 18zm5.437 0l1.063 1.063l-.407 2.28l-.656.657l-2-2zm-8.125 2.719l2 2l-2 2.031l-2-2zm5.406 0l2 2l-2 2l-2-2zm-8.094 2.718l2 2L9 24h-.063c-.391 0-.621-.13-.874-.406a2.65 2.65 0 0 1-.594-1.188v-.031l-.125-.75l.218-.188zm5.407 0l2 2l-.563.563H11.5l-.563-.563l2.032-2zm5.406 0l.281.282l-.125.656c-.002.01.002.02 0 .031c-.095.49-.316.922-.562 1.188c-.252.27-.509.406-.907.406h-.125l-.562-.563z" fill="#ff4d4f" />
                                                    </svg>
                                                    Borrar grupo
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: cardColor,
                            borderRadius: "8px",
                            overflow: "hidden",
                            maxHeight: "270px", // Altura máxima para el scroll
                            overflowY: "auto",
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
                            {/* Encabezado de la tabla */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr 1fr auto" : "50px 1fr 1fr auto",
                                padding: "1rem",
                                borderBottom: `1px solid ${borderColor}`,
                                color: lightTextColor,
                                fontSize: "0.9rem",
                                fontWeight: "500"
                            }}>
                                {!isMobile && <div>#</div>}
                                <div>Nombre</div>
                                {!isMobile && <div>Email</div>}
                                <div></div>
                            </div>

                            {/* Lista de miembros */}
                            {teamData.membersList.map((member, index) => (
                                <div key={member.id} style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile ? "1fr auto" : "50px 1fr 1fr auto",
                                    padding: "1rem",
                                    alignItems: "center",
                                    borderBottom: `1px solid ${borderColor}`,
                                    ":hover": {
                                        backgroundColor: "rgba(255,255,255,0.05)"
                                    }
                                }}>
                                    {!isMobile && <div style={{ color: lightTextColor }}>{index + 1}</div>}
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                                            <div style={{ fontWeight: "500", color: textColor }}>
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
                                            {isMobile && (
                                                <div style={{ fontSize: "0.8rem", color: lightTextColor }}>
                                                    {member.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!isMobile && <div style={{ color: lightTextColor }}>{member.email}</div>}
                                    {(teamData.isAdmin && !member.isAdmin) && (
                                        <div style={{ position: "relative" }} className="member-options">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowMemberOptions(showMemberOptions === member.id ? null : member.id);
                                                }}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    color: lightTextColor,
                                                    cursor: "pointer",
                                                    padding: "0.5rem",
                                                    borderRadius: "4px",
                                                    ":hover": {
                                                        backgroundColor: "rgba(255,255,255,0.1)"
                                                    }
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill={lightTextColor} />
                                                </svg>
                                            </button>

                                            {showMemberOptions === member.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    whileHover={{ backgroundColor: "rgba(255, 35, 39, 0.19)" }}
                                                    style={{
                                                        position: "absolute",
                                                        right: "0",
                                                        top: "40px",
                                                        backgroundColor: cardColor,
                                                        borderRadius: "8px",
                                                        border: `1px solid ${borderColor}`,
                                                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                                        zIndex: 30,
                                                        minWidth: "100px",
                                                        overflow: "hidden"
                                                    }}
                                                >
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
                                                            gap: "0.75rem"
                                                        }}
                                                    >
                                                        <svg width="14.5" height="15" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.875 0a1 1 0 0 0-.594.281L5.562 5H3c-.551 0-1 .449-1 1v2c0 .551.449 1 1 1h.25l2.281 13.719v.062c.163.788.469 1.541 1.032 2.157A3.26 3.26 0 0 0 8.938 26h8.124a3.26 3.26 0 0 0 2.375-1.031c.571-.615.883-1.405 1.032-2.219v-.031L22.78 9H23c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1h-1.563l-2.812-3.5a.81.81 0 0 0-.719-.313a.8.8 0 0 0-.343.125L14.688 3.25L11.717.281A1 1 0 0 0 10.876 0zM11 2.438L13.563 5H8.436L11 2.437zm6.844.656L19.375 5h-2.938l-.593-.594zM5.25 9h.688l1.187 1.188l-1.438 1.406zm2.094 0h.937l-.469.469zm2.312 0h1.688l.906.906l-2 2l-1.75-1.75zm3.125 0h.344l-.156.188L12.78 9zm1.781 0h1.688l1.156 1.156l-1.75 1.75l-2-2.031zm3.063 0h.938l-.47.469L17.626 9zm2.344 0h.812l-.437 2.688l-1.532-1.532zm-7.032 1.594l2.032 2l-2.031 2l-2-2l2-2zm-5.124.281l1.718 1.719l-2 2l-1.625-1.625l-.031-.156zm10.28 0l2 2l-1.718 1.75l-2-2.031l1.719-1.719zm-7.843 2.438l2 2l-2 2l-2-2zm5.406 0l2.031 2l-2 2l-2.03-2zm4.188 1.25l-.219 1.312l-.563-.563l.782-.75zm-13.657.093l.657.656l-.469.47zM7.532 16l2 2l-2 2.031l-.562-.562l-.407-2.5zm5.407 0l2.03 2.031l-2 2L10.939 18zm5.437 0l1.063 1.063l-.407 2.28l-.656.657l-2-2zm-8.125 2.719l2 2l-2 2.031l-2-2zm5.406 0l2 2l-2 2l-2-2zm-8.094 2.718l2 2L9 24h-.063c-.391 0-.621-.13-.874-.406a2.65 2.65 0 0 1-.594-1.188v-.031l-.125-.75l.218-.188zm5.407 0l2 2l-.563.563H11.5l-.563-.563l2.032-2zm5.406 0l.281.282l-.125.656c-.002.01.002.02 0 .031c-.095.49-.316.922-.562 1.188c-.252.27-.509.406-.907.406h-.125l-.562-.563z" fill="#ff4d4f" />
                                                        </svg>
                                                        Expulsar
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
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
                                onClick={handleSaveTeamChanges}
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
                            overflowY: "auto"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ margin: 0, color: textColor }}>Crear nuevo evento</h3>
                            <button
                                onClick={() => {
                                    setShowCreateEventModal(false);
                                    resetEventFields();
                                }}
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
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1.5rem"
                            }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: `3px solid ${primaryColor}`,
                                    boxShadow: `0 0 15px rgba(255, 69, 0, 0.3)`,
                                    position: "relative",
                                    marginRight: "1rem"
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
                                <div style={{
                                    fontSize: "1.8rem",
                                    fontWeight: "bold",
                                    color: primaryColor,
                                    padding: "0 1rem",
                                    textShadow: `0 0 10px rgba(255, 69, 0, 0.5)`
                                }}>
                                    VS
                                </div>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: `3px solid ${primaryColor}`,
                                    boxShadow: `0 0 15px rgba(255, 69, 0, 0.3)`,
                                    position: "relative",
                                    marginLeft: "1rem",
                                    paddingBottom: "0.15rem",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }} onClick={() => setShowTeamSearchModal(true)}>
                                    {opponentImage ? (
                                        <img src={opponentImage} alt={opponentTeam} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ textAlign: "center" }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill={lightTextColor} />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {showTeamSearchModal && (
                                    <div style={{
                                        position: "fixed",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(0,0,0,0.7)",
                                        backdropFilter: "blur(5px)",
                                        zIndex: 110,
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
                                                overflowY: "auto"
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                                <h3 style={{ margin: 0, color: textColor }}>Seleccionar equipo rival</h3>
                                                <button
                                                    onClick={() => setShowTeamSearchModal(false)}
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

                                            <div style={{ position: "relative", marginBottom: "1rem" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar equipo..."
                                                    value={searchTeamQuery}
                                                    onChange={(e) => setSearchTeamQuery(e.target.value)}
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

                                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                {teams
                                                    .filter(team => team.name.toLowerCase().includes(searchTeamQuery.toLowerCase()))
                                                    .map(team => (
                                                        <div
                                                            key={team.id}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                padding: "0.75rem",
                                                                borderBottom: `1px solid ${borderColor}`,
                                                                cursor: "pointer",
                                                                ":hover": {
                                                                    backgroundColor: "rgba(255,255,255,0.05)"
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                setOpponentTeam(team.name);
                                                                setOpponentImage(team.image);
                                                                setShowTeamSearchModal(false);
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: "50px",
                                                                height: "50px",
                                                                borderRadius: "50%",
                                                                overflow: "hidden",
                                                                marginRight: "1rem",
                                                                backgroundColor: "rgba(255,255,255,0.1)"
                                                            }}>
                                                                {
                                                                    team.image ? (
                                                                        <img src={team.image} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                    ) : (
                                                                        <div style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            color: lightTextColor
                                                                        }}>
                                                                            {team.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                            <div style={{ fontWeight: "500", color: textColor }}>{team.name}</div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
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
                                        outline: "none",

                                    }}
                                    min={new Date().toISOString().split('T')[0]} // Para que no se puedan seleccionar fechas pasadas
                                />
                                <style>
                                    {`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            filter: invert(1);
                                        }
                                    `}
                                </style>
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
                                <style>
                                    {`
                                        input[type="time"]::-webkit-calendar-picker-indicator {
                                            filter: invert(1);
                                        }
                                    `}
                                </style>
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
                        top: "15px",
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
        </div>
    );
}

export default PantallaInfoEquipo;