// Funciones para manejar el inicio de sesion de usuarios
import axios from "axios";
import SockJS from 'sockjs-client';
import { Stomp, Client } from '@stomp/stompjs';

export const loginUser = async (credentials) => {
  try {
    console.log("Enviando credenciales:", credentials);
    const response = await axios.post(
      "http://localhost:8080/api/login",
      {
        correoElectronico: credentials.correoElectronico, // ← Cambiado a guión bajo
        contrasena: credentials.contrasena,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error completo:", error.response);
    throw new Error(
      error.response?.data?.message || "Credenciales incorrectas"
    );
  }
};

// Función para manejar el registro de usuarios
export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:8080/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Error en el registro");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//funcion para verificar si el correo ya existe
export const verificarEmail = async (email) => {
  try {
    const response = await fetch("http://localhost:8080/api/existe-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      return true;
    }

    // Si viene con contenido (por ejemplo, error 404 con mensaje)
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Este correo no está vinculado a ninguna cuenta"
      );
    }

    return true;
  } catch (error) {
    console.error("Error al verificar el email:", error);
    // Aseguramos que siempre devolvamos un mensaje de error legible
    throw new Error(
      error.message || "Error al verificar el correo electrónico"
    );
  }
};

// Actualizar contraseña
export const actualizarContrasena = async (email, nuevaContrasena) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/actualizar-contrasena",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          nuevaContrasena: nuevaContrasena,
        }),
      }
    );

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Error al actualizar la contraseña. Código: " + response.status
      );
    }

    return data || { success: true }; // Devuelve datos o objeto de éxito
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    throw new Error(
      error.message ||
        "No se pudo conectar con el servidor para actualizar la contraseña"
    );
  }
};

export const loadPosts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/publicaciones");

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = userData?.correoElectronico;

    const postsData = await Promise.all(response.data.map(async (post) => {
      const usuario = post.usuario || {
        id: 0,
        nombreUsuario: "Anónimo",
        correoElectronico: "anonimo@example.com",
      };

      const categoria = post.categoriaDeporte || { nombre: "General" };

      let isLiked = false;
      if (userEmail) {
        try {
          const likeResponse = await axios.get(
            `http://localhost:8080/api/publicaciones/${post.id}/check-like`,
            { params: { userEmail } }
          );
          isLiked = likeResponse.data;
        } catch (error) {
          console.error("Error verificando like:", error);
        }
      }

      // Manejo mejorado de la fecha
      let postDate;
      if (post.fechaHora) {
        // Si es un timestamp en segundos
        if (typeof post.fechaHora === 'number') {
          postDate = new Date(post.fechaHora * 1000);
        } 
        // Si es un string ISO (como "2023-10-05T12:00:00Z")
        else if (typeof post.fechaHora === 'string') {
          postDate = new Date(post.fechaHora);
        }
        // Si es un objeto Date (poco probable desde el backend)
        else if (post.fechaHora instanceof Date) {
          postDate = post.fechaHora;
        }
      }
      
      // Si no se pudo parsear, usa la fecha actual
      if (!postDate || isNaN(postDate.getTime())) {
        console.warn(`Fecha inválida para post ${post.id}, usando fecha actual`);
        postDate = new Date();
      }

      return {
        id: post.id,
        userId: usuario.id,
        user: usuario.correoElectronico || "anonimo@example.com",
        name: usuario.nombreUsuario || "Anónimo",
        content: post.contenido || "",
        time: postDate, 
        comments: post.comentarios || 0,
        likes: post.likes || 0,
        shares: post.compartidos || 0,
        sport: categoria.nombre || "General",
        isLiked: isLiked,
      };
    }));

    return postsData;
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
};

export const darLike = async (postId, userEmail) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/publicaciones/${postId}/like`,
      { userEmail },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al dar like:", error);
    throw error;
  }
};

export const quitarLike = async (postId, userEmail) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/publicaciones/${postId}/unlike`,
      { userEmail },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al quitar like:", error);
    throw error;
  }
};

export const checkLikeStatus = async (postId, userEmail) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/publicaciones/${postId}/check-like`,
      { params: { userEmail } }
    );
    return response.data;
  } catch (error) {
    console.error("Error verificando like:", error);
    return false;
  }
};


export const crearPublicacion = async (publicacionData) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/publicaciones/crearPubli', // Cambiado el endpoint
      publicacionData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al crear publicación:', error);
    throw error;
  }
};


const BASE_URL = 'http://localhost:8080';


// Funciones para manejar comentarios
export const getComentarios = async (publicacionId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/comentarios/publicaciones/${publicacionId}`);
    
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }
      console.log("Respuesta de la API:", response.data);


    return response.data.map(comment => processComment(comment));
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  }
};

export const processComment = (comment) => {
   const usuario = {
    id: comment.usuarioId || 0,
    nombreUsuario: comment.usuarioNombre || "Anónimo",
    correoElectronico: comment.usuarioCorreo || "anonimo@example.com",
  };

  // Manejo de fecha igual que en las publicaciones
  let commentDate;
  if (comment.fechaHora) {
    if (typeof comment.fechaHora === 'number') {
      commentDate = new Date(comment.fechaHora * 1000);
    } else if (typeof comment.fechaHora === 'string') {
      commentDate = new Date(comment.fechaHora);
    } else if (comment.fechaHora instanceof Date) {
      commentDate = comment.fechaHora;
    }
  }
  
  if (!commentDate || isNaN(commentDate.getTime())) {
    commentDate = new Date();
  }

  return {
    id: comment.id,
    userId: usuario.id,
    user: usuario.correoElectronico,
    name: usuario.nombreUsuario,
    content: comment.contenido,
    time: commentDate,
    likes: comment.likes || 0,
    isLiked: comment.isLiked || false
  };
};

export const crearComentario = async (comentarioData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/api/comentarios`, comentarioData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Mapea la respuesta al formato esperado
   return {
         id: response.data.id,
      contenido: response.data.contenido,
      usuario: {
        id: response.data.usuarioId,
        nombre: response.data.usuarioNombre,
        nombreUsuario: response.data.usuarioNombre,
        correoElectronico: response.data.usuarioCorreo
      },
      fechaHora: response.data.fechaHora,
      likes: 0,
      isLiked: false
      };
  } catch (error) {
    console.error('Error al crear comentario:', error);
    throw error;
  }
};
// En api.js
export const getPublicacion = async (postId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/publicaciones/${postId}`);

    if (!response.data) {
      throw new Error('Publicación no encontrada');
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = userData?.correoElectronico;

    const post = response.data;
    const usuario = post.usuario || {
      id: 0,
      nombreUsuario: "Anónimo",
      correoElectronico: "anonimo@example.com",
    };

    const categoria = post.categoriaDeporte || { nombre: "General" };

    let isLiked = false;
    if (userEmail) {
      try {
        const likeResponse = await axios.get(
          `http://localhost:8080/api/publicaciones/${post.id}/check-like`,
          { params: { userEmail } }
        );
        isLiked = likeResponse.data;
      } catch (error) {
        console.error("Error verificando like:", error);
      }
    }

    console.log("Respuesta de la API publi:", response.data);

    // Manejo consistente de la fecha (igual que en loadPosts)
    let postDate;
    if (post.fechaHora) {
      if (typeof post.fechaHora === 'number') {
        postDate = new Date(post.fechaHora * 1000);
      } else if (typeof post.fechaHora === 'string') {
        postDate = new Date(post.fechaHora);
      } else if (post.fechaHora instanceof Date) {
        postDate = post.fechaHora;
      }
    }
    
    if (!postDate || isNaN(postDate.getTime())) {
      console.warn(`Fecha inválida para post ${post.id}, usando fecha actual`);
      postDate = new Date();
    }

    return {
      id: post.id,
      userId: usuario.id,
      user: usuario.correoElectronico || "anonimo@example.com",
      name: usuario.nombreUsuario || "Anónimo",
      content: post.contenido || "",
      time: postDate,
      comments: post.comentarios || 0,
      likes: post.likes || 0,
      shares: post.compartidos || 0,
      sport: categoria.nombre || "General",
      isLiked: isLiked,
    };

  } catch (error) {
    console.error("Error loading single post:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};


// Funciones para manejar likes en comentarios
// NO SE ESTA USANDO, NO FUNCIONA, SE PUEDE MODIFICAR PARA QUE FUNCIONE
export const darLikeComent = async (comentarioId, userEmail) => {
    const response = await axios.post(
        `http://localhost:8080/api/comentarios/${comentarioId}/like`,
        { userEmail }
    );
    return response.data;
};

export const quitarLikeComent = async (comentarioId, userEmail) => {
    const response = await axios.post(
        `http://localhost:8080/api/comentarios/${comentarioId}/unlike`,
        { userEmail }
    );
    return response.data;
};

export const checkLikeStatusComent = async (comentarioId, userEmail) => {
    const response = await axios.get(
        `http://localhost:8080/api/comentarios/${comentarioId}/check-like`,
        { params: { userEmail } }
    );
    return response.data;
};


//Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/usuarios");
    console.log("Usuarios recibidos:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Añade estas funciones al final de tu api.js

/**
 * Obtiene los datos de un usuario por su ID
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw new Error(error.response?.data?.message || "Error al obtener datos del usuario");
  }
};

/**
 * Obtiene las publicaciones de un usuario específico
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de publicaciones
 */
export const getUserPosts = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/publicaciones/usuario/${userId}`);
    const posts = response.data;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = userData?.correoElectronico;

    return posts.map(post => ({
      id: post.id,
      contenido: post.contenido,
      fechaHora: new Date(post.fechaHora),
      likes: post.likes || 0,
      comments: post.comentarios || 0,
      shares: post.compartidos || 0,
      categoriaDeporteId: post.categoriaDeporte?.nombre?.toLowerCase() || "general",
      name: post.usuario?.nombreUsuario || "Anónimo",
      userUsername: post.usuario?.correoElectronico || "anonimo@example.com",
      isLiked: post.isLiked || false,
    }));
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};

// Obtener todas las publicaciones (para feed)
export const getAllPosts = async () => {
  try {
    const response = await fetch('/api/posts');
    const data = await response.json();
    return data.posts.map(post => ({
      id: post.id,
      contenido: post.content,
      fechaHora: post.created_at,
      likes: post.likes_count,
      comments: post.comments_count,
      shares: post.shares_count,
      isLiked: post.is_liked,
      categoriaDeporteId: post.sport_category || "General",
      name: post.author_name,
      userUsername: post.author_username,
      authorImage: post.author_image
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getUserTeams = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/equipos/usuario/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user teams:", error);
    return [];
  }
};

export const getAllTeams = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/equipos/comunidad/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all teams:", error);
    return [];
  }
};

export const createTeam = async (teamData) => {
  try {
    const response = await axios.post('http://localhost:8080/api/equipos', teamData);
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

/**
 * Actualiza los datos del perfil de un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} profileData - Datos del perfil a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/usuarios/${userId}/perfil`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar el perfil");
  }
};

/**
 * Sube una imagen de perfil
 * @param {number} userId - ID del usuario
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(
      `http://localhost:8080/api/usuarios/${userId}/imagen-perfil`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al subir imagen de perfil:", error);
    throw new Error(error.response?.data?.message || "Error al subir la imagen");
  }
};

//-------------------------------------------------------------------------------------\\
// MENSAJERIA 
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mensajeService = {
  // Mensajes
  enviarMensaje: (mensaje) => axios.post(`${BASE_URL}/api/mensajes`, mensaje),
  obtenerMensajesConversacion: (conversacionId) => axios.get(`${BASE_URL}/api/mensajes/conversacion/${conversacionId}`),
  obtenerConversacionesUsuario: (usuarioId) => axios.get(`${BASE_URL}/api/mensajes/usuario/${usuarioId}`),
  marcarMensajesLeidos: (conversacionId, usuarioId) => axios.put(`${BASE_URL}/api/mensajes/marcar-leidos/${conversacionId}/${usuarioId}`),

  // Conversaciones
  crearConversacion: (usuario1Id, usuario2Id) => axios.post(`${BASE_URL}/api/conversaciones?usuario1Id=${usuario1Id}&usuario2Id=${usuario2Id}`),
  obtenerConversacionesUsuario: (usuarioId) => axios.get(`${BASE_URL}/api/conversaciones/usuario/${usuarioId}`),
  obtenerUsuario: (userId) => axios.get(`${BASE_URL}/api/usuarios/${userId}`),
  obtenerUsuariosPorIds: (userIds) => axios.get(`${BASE_URL}/api/usuarios/buscar-por-ids`, {
    params: { ids: userIds.join(',') }
  }),


  // Usuarios
  buscarUsuarios: (query) => axios.get(`${BASE_URL}/api/buscar?query=${query}`)
};

export const setupWebSocket = (conversacionId, onMessageReceived, onError) => {
  const socket = new SockJS('http://localhost:8080/ws');

  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => console.log('STOMP:', str),
    onConnect: () => {
      console.log('✅ WebSocket conectado correctamente');

      stompClient.subscribe(`/topic/conversation.${conversacionId}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log(`📩 [${conversacionId}] Mensaje recibido:`, parsedMessage);
          onMessageReceived(parsedMessage);
        } catch (error) {
          console.error(`❌ Error procesando mensaje:`, error);
        }
      });
    },
    onStompError: (frame) => {
      console.error('❌ STOMP Error:', frame.headers.message || frame.body);
      if (onError) onError(frame);
    },
    onWebSocketClose: () => {
      console.warn('⚠️ WebSocket cerrado');
    }
  });

  stompClient.activate();
  return stompClient;
};

export const sendMessageWebSocket = (stompClient, conversacionId, mensajeDTO) => {
  if (stompClient && stompClient.active) {
  stompClient.publish({
    destination: `/app/chat/${conversacionId}`,
    body: JSON.stringify(mensajeDTO),
  });
  console.log('✉️ Mensaje enviado:', mensajeDTO);
} else {
  console.error('⚠️ No se pudo enviar - WebSocket no activo');
}
};

export const setupWebSocketMultiple = (conversationIds, onMessageReceived, onError) => {
  const socket = new SockJS('http://localhost:8080/ws');

  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => console.log('STOMP:', str),
    onConnect: () => {
      console.log('✅ WebSocket conectado correctamente');

      // 🟢 SUSCRIPCIÓN CORRECTA (ajustada a tu backend)
      conversationIds.forEach(id => {
        stompClient.subscribe(`/topic/conversation.${id}`, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log(`📩 [${id}] Mensaje recibido:`, parsedMessage);
            onMessageReceived(parsedMessage);
          } catch (error) {
            console.error(`❌ Error procesando mensaje:`, error);
          }
        });
      });
    },
    onStompError: (frame) => {
      console.error('❌ STOMP Error:', frame.headers.message || frame.body);
      if (onError) onError(frame);
    },
    onWebSocketClose: () => {
      console.warn('⚠️ WebSocket cerrado');
    }
  });

  stompClient.activate();
  return stompClient;
};