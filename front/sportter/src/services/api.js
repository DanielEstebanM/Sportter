// Funciones para manejar el inicio de sesion de usuarios
import axios from "axios";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/login",
      {
        correoElectronico: credentials.correoElectronico,
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
    // Lanzamos un error con el mensaje específico
    throw new Error(
      error.response?.data?.message || "Usuario o contraseña incorrectos"
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
        time: postDate, // Usamos el objeto Date ya creado
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
