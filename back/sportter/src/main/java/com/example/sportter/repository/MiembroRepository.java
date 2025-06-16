package com.example.sportter.repository;

import com.example.sportter.model.Miembro;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MiembroRepository extends JpaRepository<Miembro, Long> {
    boolean existsByEquipoIdAndUsuarioId(Long equipoId, Long usuarioId);
    void deleteByEquipoIdAndUsuarioId(Long equipoId, Long usuarioId);
    
 // Opción 1: Query method (recomendado)
    List<Miembro> findByUsuarioId(Long usuarioId);

    // Opción 2: JPQL corregido
    @Query("SELECT m FROM Miembro m WHERE m.usuario.id = :usuarioId")
    List<Miembro> encontrarPorUsuarioId(@Param("usuarioId") Long usuarioId);

    // Opción 3: Query nativo (alternativa)
    @Query(value = "SELECT * FROM miembros WHERE usuario_id = :usuarioId", nativeQuery = true)
    List<Miembro> encontrarPorUsuarioIdNativo(@Param("usuarioId") Long usuarioId);
}