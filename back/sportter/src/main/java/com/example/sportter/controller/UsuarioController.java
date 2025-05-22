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

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		Optional<Usuario> usuario = usuarioRepository.findByCorreoElectronicoAndContrasena(
				loginRequest.getCorreoElectronico(), loginRequest.getContrasena());

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

	// Verificar si el email existe
	@PostMapping("/existe-email")
	public ResponseEntity<?> verificarEmail(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		boolean existe = usuarioRepository.existsByCorreoElectronico(email);

		if (existe) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "Este correo no está vinculado a ninguna cuenta"));
		}
	}

	// Actualizar contraseña
	@PostMapping("/actualizar-contrasena")
	public ResponseEntity<?> actualizarContrasena(@RequestBody CambioContrasenaRequest request) {
		Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoElectronico(request.getEmail());

		if (usuarioOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
		}

		Usuario usuario = usuarioOpt.get();
		usuario.setContrasena(request.getNuevaContrasena()); // Asegúrate de hashear la contraseña aquí
		usuarioRepository.save(usuario);

		return ResponseEntity.ok().build();
	}

}
