package com.example.sportter.controller;

import com.example.sportter.model.CambioContrasenaRequest;
import com.example.sportter.model.LoginRequest;
import com.example.sportter.model.Usuario;
import com.example.sportter.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreoElectronicoAndContrasena(
            loginRequest.getCorreoElectronico(),
            loginRequest.getContrasena()
        );

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrecta");
        }
    }
    
    
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            // Verificar si el correo ya existe
            if (usuarioRepository.existsByCorreoElectronico(usuario.getCorreoElectronico())) {
                return ResponseEntity.badRequest().body("El correo electrónico ya está en uso");
            }
            
            // Guardar el usuario
            
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al registrar el usuario");
        }
    }
    
    @PutMapping("/cambiar-contrasena")
    public ResponseEntity<?> cambiarContrasena(@RequestBody CambioContrasenaRequest request) {
        try {
            // Validar que los campos requeridos estén presentes
            if (request.getCorreoElectronico() == null || request.getContrasenaActual() == null || request.getNuevaContrasena() == null) {
                return ResponseEntity.badRequest().body("Todos los campos son requeridos");
            }

            // Buscar usuario por correo electrónico
            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoElectronico(request.getCorreoElectronico());
            
            if (!usuarioOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }
            
            Usuario usuario = usuarioOpt.get();
            
            // Verificar que la contraseña actual coincida
            if (!usuario.getContrasena().equals(request.getContrasenaActual())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña actual incorrecta");
            }
            
            // Validar que la nueva contraseña sea diferente a la actual
            if (usuario.getContrasena().equals(request.getNuevaContrasena())) {
                return ResponseEntity.badRequest().body("La nueva contraseña debe ser diferente a la actual");
            }
            
            // Actualizar la contraseña
            usuario.setContrasena(request.getNuevaContrasena());
            usuarioRepository.save(usuario);
            
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al cambiar la contraseña: " + e.getMessage());
        }
    }
}
