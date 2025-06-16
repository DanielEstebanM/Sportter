package com.example.sportter.controller;

import com.example.sportter.dto.CambioContrasenaRequest;
import com.example.sportter.dto.UsuarioDTO;
import com.example.sportter.model.Equipo;
import com.example.sportter.model.LoginRequest;
import com.example.sportter.model.Miembro;
import com.example.sportter.model.Usuario;
import com.example.sportter.repository.EquipoRepository;
import com.example.sportter.repository.MiembroRepository;
import com.example.sportter.repository.UsuarioRepository;
import com.example.sportter.service.EquipoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

	@Autowired
	private UsuarioRepository usuarioRepository;
	
	@Autowired
	private EquipoRepository equipoRepository;
	
	@Autowired
	private MiembroRepository miembroRepository;
	
	@Autowired
	private EquipoService equipoService;

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoElectronico(loginRequest.getCorreoElectronico());

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

	@PostMapping("/registro")
	public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
		try {
			if (usuarioRepository.existsByCorreoElectronico(usuario.getCorreoElectronico())) {
				return ResponseEntity.badRequest().body("El correo electrónico ya está en uso");
			}

			// Hashear la contraseña antes de guardar
			usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

			Usuario nuevoUsuario = usuarioRepository.save(usuario);
			return ResponseEntity.ok(nuevoUsuario);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario");
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

	@GetMapping("/buscar")
	public ResponseEntity<List<UsuarioDTO>> buscarUsuarios(@RequestParam String query) {
		List<Usuario> usuarios = usuarioRepository
				.findByNombreUsuarioContainingIgnoreCaseOrCorreoElectronicoContainingIgnoreCase(query, query);
		List<UsuarioDTO> usuariosDTO = usuarios.stream().map(this::convertirAUsuarioDTO).collect(Collectors.toList());
		return ResponseEntity.ok(usuariosDTO);
	}

	private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
		UsuarioDTO dto = new UsuarioDTO();
		dto.setId(usuario.getId());
		dto.setNombre(usuario.getNombreUsuario());
		dto.setNombreUsuario(usuario.getNombreUsuario());
		dto.setEmail(usuario.getCorreoElectronico());
		dto.setAvatar(usuario.getImagen_perfil());
		return dto;
	}

	@GetMapping("/usuarios/{id}")
	public ResponseEntity<UsuarioDTO> obtenerUsuario(@PathVariable Long id) {
	    Usuario usuario = usuarioRepository.findById(id).orElseThrow();
	    UsuarioDTO dto = convertirAUsuarioDTO(usuario);
	    return ResponseEntity.ok(dto);
	}

	@GetMapping("/usuarios")
	public ResponseEntity<List<Usuario>> getAllUsuarios() {
		List<Usuario> usuarios = usuarioRepository.findAll();

		usuarios.forEach(u -> u.setContrasena(null));

		return ResponseEntity.ok(usuarios);
	}
	
	@DeleteMapping("/usuarios/{id}")
	@Transactional
	public ResponseEntity<?> desactivarUsuario(@PathVariable Long id) {
	    try {
	        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
	        
	        if (usuarioOpt.isEmpty()) {
	            return ResponseEntity.notFound().build();
	        }

	        // 1. Eliminar al usuario de todos los equipos donde es miembro
	        miembroRepository.deleteByUsuarioId(id);
	        
	        // 2. Reasignar equipos donde era creador
	        List<Equipo> equiposComoCreador = equipoRepository.findByCreadorId(id);
	        for (Equipo equipo : equiposComoCreador) {
	            // Buscar otro miembro para asignar como admin
	            Optional<Miembro> nuevoAdminOpt = miembroRepository.findFirstByEquipoIdAndUsuarioIdNot(
	                equipo.getId(), id);
	            
	            if (nuevoAdminOpt.isPresent()) {
	                equipo.setCreador(nuevoAdminOpt.get().getUsuario());
	                equipoRepository.save(equipo);
	            } else {
	                // Si no hay otros miembros, eliminar el equipo
	                equipoService.eliminarEquipo(equipo.getId());
	            }
	        }

	        // 3. Finalmente eliminar el usuario
	        usuarioRepository.deleteById(id);
	        
	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Error al desactivar la cuenta: " + e.getMessage());
	    }
	}

}