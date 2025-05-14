
// Funciones para manejar el inicio de sesion de usuarios
export const loginUser = async (credentials) => {
    try {
      console.log("Enviando credenciales:", credentials);
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
            correoElectronico: credentials.correoElectronico,  // ← Cambiado a guión bajo
            contrasena: credentials.contrasena
        },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error completo:", error.response);
      throw new Error(error.response?.data?.message || "Credenciales incorrectas");
    }
  };


  // Función para manejar el registro de usuarios
  export const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:8080/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Error en el registro');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

import axios from 'axios';

