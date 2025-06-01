// Funciones para manejar el inicio de sesion de usuarios
import axios from "axios";

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