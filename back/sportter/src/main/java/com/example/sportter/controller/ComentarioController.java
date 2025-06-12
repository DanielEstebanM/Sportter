package com.example.sportter.controller;

import com.example.sportter.dto.*;
import com.example.sportter.model.*;
import com.example.sportter.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "http://localhost:3000")
public class ComentarioController {

    @Autowired
    private ComentarioRepository comentarioRepository;
    
    @Autowired
    private PublicacionRepository publicacionRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    

    // Obtener comentarios por publicación
    @GetMapping("/publicaciones/{publicacionId}")
    public ResponseEntity<List<ComentarioResponseDto>> getComentariosPorPublicacion(
            @PathVariable Long publicacionId) {
        
    	List<Comentario> comentarios = comentarioRepository.findByPublicacionIdOrderByFechaHoraDesc(publicacionId);        
        List<ComentarioResponseDto> response = comentarios.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // Crear nuevo comentario
    @PostMapping
    public ResponseEntity<ComentarioResponseDto> crearComentario(
            @RequestBody ComentarioDto comentarioDto) {
        
        Publicacion publicacion = publicacionRepository.findById(comentarioDto.getPublicacionId())
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        
        Usuario usuario = usuarioRepository.findById(comentarioDto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Comentario comentario = new Comentario();
        comentario.setContenido(comentarioDto.getContenido());
        comentario.setPublicacion(publicacion);
        comentario.setUsuario(usuario);
        comentario.setFechaHora(LocalDateTime.now());
        comentario.setLikes((long) 0);
        
        Comentario savedComentario = comentarioRepository.save(comentario);
        
        publicacionRepository.incrementarComentarios(publicacion.getId());
        
        //publicacionRepository.actualizarConteoDeComentarios();

        
        return ResponseEntity.ok(convertToDto(savedComentario));
        
    }
    

    private ComentarioResponseDto convertToDto(Comentario yaDioLike) {
    	
    	System.out.println("Accediendo a usuario de comentario: " + yaDioLike.getId());

        ComentarioResponseDto dto = new ComentarioResponseDto();
        dto.setId(yaDioLike.getId());
        dto.setContenido(yaDioLike.getContenido());
        dto.setLikes(yaDioLike.getLikes());
        dto.setUsuarioNombre(yaDioLike.getUsuario().getNombreUsuario());
        dto.setUsuarioCorreo(yaDioLike.getUsuario().getCorreoElectronico());
        dto.setFechaHora(yaDioLike.getFechaHora());
        return dto;
    }
    
    // FUNCIONES PARA LIKES DE COMENTARIOS (ENTRA EN BUCLE)
    
    /*
    @PostMapping("/{comentarioId}/like")
    public ResponseEntity<?> darLikeComentario(
            @PathVariable Long comentarioId,
            @RequestBody Map<String, String> request) {
        
        String userEmail = request.get("userEmail");
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        
        Usuario usuario = usuarioRepository.findByCorreoElectronico(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!comentario.containsUsuarioLike(usuario)) {
            comentario.addUsuarioLike(usuario);
            comentarioRepository.save(comentario);
        }
        
        return ResponseEntity.ok(Map.of(
            "likes", comentario.getLikes(),
            "likeRealizado", true
        ));
    }

    @PostMapping("/{comentarioId}/unlike")
    public ResponseEntity<?> quitarLikeComentario(
            @PathVariable Long comentarioId,
            @RequestBody Map<String, String> request) {
        
        String userEmail = request.get("userEmail");
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        
        Usuario usuario = usuarioRepository.findByCorreoElectronico(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (comentario.containsUsuarioLike(usuario)) {
            comentario.removeUsuarioLike(usuario);
            comentarioRepository.save(comentario);
        }
        
        return ResponseEntity.ok(Map.of(
            "likes", comentario.getLikes(),
            "likeRealizado", false
        ));
    }

    @GetMapping("/{comentarioId}/check-like")
    public ResponseEntity<Boolean> checkLikeComentario(
            @PathVariable Long comentarioId,
            @RequestParam String userEmail) {
        
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        
        Usuario usuario = usuarioRepository.findByCorreoElectronico(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return ResponseEntity.ok(comentario.containsUsuarioLike(usuario));
    }*/

}