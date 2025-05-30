package com.example.sportter.controller;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sportter.model.Publicacion;
import com.example.sportter.model.Usuario;
import com.example.sportter.repository.PublicacionRepository;
import com.example.sportter.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionRepository publicacionRepository;

    @GetMapping
    public ResponseEntity<?> getAllPublications() {
        try {
            List<Publicacion> publicaciones = publicacionRepository.findAllWithUserAndCategory();
            
            // Log para depuración
            System.out.println("Número de publicaciones encontradas: " + publicaciones.size());
            publicaciones.forEach(p -> {
                System.out.println("Publicación ID: " + p.getId());
                System.out.println("Contenido: " + p.getContenido());
                if(p.getUsuario() != null) {
                    System.out.println("Usuario: " + p.getUsuario().getNombreUsuario());
                } else {
                    System.out.println("Usuario: NULL");
                }
            });
            
            return ResponseEntity.ok(publicaciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al obtener publicaciones: " + e.getMessage());
        }
    }
    
    
    @PostMapping("/{publicacionId}/like")
    public ResponseEntity<?> darLike(@PathVariable Long publicacionId, @RequestBody Map<String, String> request) {
        try {
            String userEmail = request.get("userEmail");
            Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
            
            // Aquí deberías verificar si el usuario ya dio like
            // Esto depende de tu modelo de datos
            // Por ahora, simplemente incrementaremos el contador
            publicacion.setLikes(publicacion.getLikes() + 1);
            publicacionRepository.save(publicacion);
            
            return ResponseEntity.ok(publicacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al dar like: " + e.getMessage());
        }
    }

    @PostMapping("/{publicacionId}/unlike")
    public ResponseEntity<?> quitarLike(@PathVariable Long publicacionId, @RequestBody Map<String, String> request) {
        try {
            String userEmail = request.get("userEmail");
            Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
            
            // Verificar que los likes no sean negativos
            if (publicacion.getLikes() > 0) {
                publicacion.setLikes(publicacion.getLikes() - 1);
                publicacionRepository.save(publicacion);
            }
            
            return ResponseEntity.ok(publicacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al quitar like: " + e.getMessage());
        }
    }
   
}