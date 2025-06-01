package com.example.sportter.controller;

import com.example.sportter.dto.CambioContrasenaRequest;
import com.example.sportter.model.LoginRequest;
import com.example.sportter.model.Usuario;
import com.example.sportter.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreoElectronicoAndContrasena(
            loginRequest.getCorreoElectronico(),
            loginRequest.getContrasena()
        );

	    if (usuarioOpt.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrecta");
	    }

	    Usuario usuario = usuarioOpt.get();
	    String contrasenaAlmacenada = usuario.getContrasena();
	    String contrasenaIngresada = loginRequest.getContrasena();

	    // Verificación híbrida
	    boolean contrasenaValida = false;
	    
	    // 1. Primero intenta con BCrypt (para contraseñas nuevas)
	    if (contrasenaAlmacenada.startsWith("$2a$")) {
	        contrasenaValida = passwordEncoder.matches(contrasenaIngresada, contrasenaAlmacenada);
	    }
	    // 2. Si no es BCrypt, compara directamente (para contraseñas existentes)
	    else {
	        contrasenaValida = contrasenaIngresada.equals(contrasenaAlmacenada);
	        
	        // Opcional: Actualizar a BCrypt si la contraseña es correcta
	        if (contrasenaValida) {
	            usuario.setContrasena(passwordEncoder.encode(contrasenaIngresada));
	            usuarioRepository.save(usuario);
	        }
	    }

	    if (contrasenaValida) {
	        return ResponseEntity.ok(usuario);
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrecta");
	    }
	}

}