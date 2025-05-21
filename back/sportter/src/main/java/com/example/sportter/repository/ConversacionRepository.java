package com.example.sportter.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sportter.model.Conversacion;

public interface ConversacionRepository extends JpaRepository<Conversacion, String> {
    List<Conversacion> findByUsuario1IdOrUsuario2Id(Long usuario1Id, Long usuario2Id);
}