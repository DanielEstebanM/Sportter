package com.example.sportter.repository;

import com.example.sportter.model.Miembro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MiembroRepository extends JpaRepository<Miembro, Long> {
    boolean existsByEquipoIdAndUsuarioId(Long equipoId, Long usuarioId);
    void deleteByEquipoIdAndUsuarioId(Long equipoId, Long usuarioId);
}