package com.example.sportter.repository;

import com.example.sportter.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    // Buscar mensajes por conversación ordenados por fecha ascendente
    List<Mensaje> findByConversacionIdOrderByFechaHoraAsc(String conversacionId);

    // Obtener el último mensaje de una conversación
    @Query("SELECT m FROM Mensaje m WHERE m.conversacionId = :conversacionId ORDER BY m.fechaHora DESC LIMIT 1")
    Mensaje findFirstByConversacionIdOrderByFechaHoraDesc(@Param("conversacionId") String conversacionId);

    // Buscar IDs de conversaciones de un usuario
    @Query("SELECT DISTINCT m.conversacionId FROM Mensaje m WHERE m.remitente.id = :usuarioId OR m.destinatario.id = :usuarioId")
    List<String> findDistinctConversacionIdsByUsuarioId(@Param("usuarioId") Long usuarioId);

    // Contar mensajes no leídos para un usuario en una conversación específica
    @Query("SELECT COUNT(m) FROM Mensaje m WHERE m.conversacionId = :conversacionId AND m.destinatario.id = :usuarioId AND m.leido = false")
    long countByConversacionIdAndDestinatarioAndLeidoFalse(@Param("conversacionId") String conversacionId, 
                                                         @Param("usuarioId") Long usuarioId);

    // Verificar si un usuario participa en una conversación
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END " +
           "FROM Mensaje m WHERE m.conversacionId = :conversacionId " +
           "AND (m.remitente.id = :usuarioId OR m.destinatario.id = :usuarioId)")
    boolean existsByConversacionIdAndParticipant(@Param("conversacionId") String conversacionId, 
                                              @Param("usuarioId") Long usuarioId);

    // Buscar mensajes entre dos usuarios específicos
    @Query("SELECT m FROM Mensaje m WHERE " +
           "(m.remitente.id = :usuario1Id AND m.destinatario.id = :usuario2Id) OR " +
           "(m.remitente.id = :usuario2Id AND m.destinatario.id = :usuario1Id) " +
           "ORDER BY m.fechaHora ASC")
    List<Mensaje> findMensajesEntreUsuarios(@Param("usuario1Id") Long usuario1Id, 
                                          @Param("usuario2Id") Long usuario2Id);

    // Marcar mensajes como leídos
    @Modifying
    @Query("UPDATE Mensaje m SET m.leido = true " +
           "WHERE m.conversacionId = :conversacionId " +
           "AND m.destinatario.id = :usuarioId " +
           "AND m.leido = false")
    void marcarMensajesComoLeidos(@Param("conversacionId") String conversacionId, 
                                @Param("usuarioId") Long usuarioId);

    // Contar todos los mensajes no leídos para un usuario
    @Query("SELECT COUNT(m) FROM Mensaje m WHERE m.destinatario.id = :usuarioId AND m.leido = false")
    long countTotalMensajesNoLeidosByUsuario(@Param("usuarioId") Long usuarioId);
}