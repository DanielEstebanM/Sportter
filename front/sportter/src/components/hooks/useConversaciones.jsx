import { useState, useEffect } from 'react';
import { mensajeService } from '../../services/api';

export const useConversaciones = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const cargarConversaciones = async () => {
      setLoading(true);
      try {
        const response = await mensajeService.obtenerConversacionesUsuario(userId);
        const conversaciones = response.data;

        // Obtener información de los otros usuarios
        const conversacionesConInfo = await Promise.all(
          conversaciones.map(async (conv) => {
            const otroUsuarioId = conv.usuario1Id === userId ? conv.usuario2Id : conv.usuario1Id;
            try {
              const usuarioRes = await mensajeService.obtenerUsuario(otroUsuarioId);
              return {
                ...conv,
                user: usuarioRes.data.nombre || `Usuario ${otroUsuarioId}`,
                username: usuarioRes.data.correoElectronico || `user${otroUsuarioId}`,
                destinatarioId: otroUsuarioId
              };
            } catch (error) {
              console.error(`Error al cargar usuario ${otroUsuarioId}:`, error);
              return {
                ...conv,
                user: `Usuario ${otroUsuarioId}`,
                username: `user${otroUsuarioId}`,
                destinatarioId: otroUsuarioId
              };
            }
          })
        );

        setConversations(conversacionesConInfo);
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    cargarConversaciones();
  }, [userId]);

  return { conversations, loadingConversations: loading };
};