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

// Función para obtener publicaciones
// In api.js, update the loadPosts function:
export const loadPosts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/publicaciones");

    if (!response.data || !Array.isArray(response.data)) {
      return []; // Return empty array if data is invalid
    }

    // Process posts synchronously (remove async from map)
    const postsData = response.data.map((post) => {
      const usuario = post.usuario || {
        id: 0,
        nombreUsuario: "Anónimo",
        correoElectronico: "anonimo@example.com",
      };

      const categoria = post.categoriaDeporte || { nombre: "General" };

      return {
        id: post.id,
        userId: usuario.id,
        user: usuario.correoElectronico || "anonimo@example.com",
        name: usuario.nombreUsuario || "Anónimo",
        content: post.contenido || "",
        time: post.fechaHora
          ? new Date(post.fechaHora).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Ahora",
        likes: post.likes || 0,
        shares: post.compartidos || 0,
        sport: categoria.nombre || "General",
        isLiked: post.isLiked || false, 
      };
    });

    return postsData;
  } catch (error) {
    console.error("Error loading posts:", error);
    return []; // Return empty array on error
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
