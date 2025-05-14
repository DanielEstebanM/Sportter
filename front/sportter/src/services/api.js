export const loginUser = async (credentials) => {
    try {
      console.log("Enviando credenciales:", credentials);
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
            correoElectronico: credentials.email,  // ← Cambiado a guión bajo
            contrasena: credentials.password
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

import axios from 'axios';

