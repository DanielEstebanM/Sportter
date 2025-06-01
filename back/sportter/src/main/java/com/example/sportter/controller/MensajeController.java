package com.example.sportter.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.sportter.model.Mensaje;
import com.example.sportter.model.Usuario;
import com.example.sportter.repository.MensajeRepository;
import com.example.sportter.repository.UsuarioRepository;
import com.example.sportter.dto.ConversacionDTO;

@RestController
public class MensajeController {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private MensajeRepository mensajeRepository;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@MessageMapping("/chat/{conversacionId}")
	public void enviarMensaje(@DestinationVariable String conversacionId, Mensaje mensaje, Principal principal) {
		// Corregido: usar usuarioRepository (minúscula) y findByCorreoElectronico
		Usuario remitente = usuarioRepository.findByCorreoElectronico(principal.getName())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		Usuario destinatario = usuarioRepository.findById(mensaje.getDestinatario().getId())
				.orElseThrow(() -> new RuntimeException("Destinatario no encontrado"));

		mensaje.setRemitente(remitente);
		mensaje.setDestinatario(destinatario);
		mensaje.setFechaHora(LocalDateTime.now());
		mensaje.setLeido(false);
		mensaje.setConversacionId(conversacionId);

		Mensaje mensajeGuardado = mensajeRepository.save(mensaje);

		// Enviar a ambos participantes de la conversación
		messagingTemplate.convertAndSend("/topic/mensajes/" + conversacionId, mensajeGuardado);
		messagingTemplate.convertAndSendToUser(destinatario.getId().toString(), "/queue/notificaciones",
				mensajeGuardado);
	}

	@GetMapping("/conversaciones")
	public ResponseEntity<List<ConversacionDTO>> obtenerConversaciones(Principal principal) {
		// Corregido: usar usuarioRepository (minúscula) y findByCorreoElectronico
		Usuario usuario = usuarioRepository.findByCorreoElectronico(principal.getName())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// Aquí continuaría la lógica para obtener conversaciones...
		return ResponseEntity.ok(null); // Reemplazar con implementación real
	}

	@GetMapping("/mensajes/{conversacionId}")
	public ResponseEntity<List<Mensaje>> obtenerMensajesConversacion(@PathVariable String conversacionId,
			Principal principal) {

		// Corrección en el nombre del método (findByCorreoElectronico)
		Usuario usuario = usuarioRepository.findByCorreoElectronico(principal.getName())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// Corrección en la validación (faltaba paréntesis de cierre)
		if (!mensajeRepository.existsByConversacionIdAndParticipant(conversacionId, usuario.getId())) {
			return ResponseEntity.status(403).build();
		}

		// Corrección en el nombre del campo (fechaHora en lugar de fechahora)
		List<Mensaje> mensajes = mensajeRepository.findByConversacionIdOrderByFechaHoraAsc(conversacionId);

		// Corrección en el nombre del método (marcarMensajesComoLeidos)
		mensajeRepository.marcarMensajesComoLeidos(conversacionId, usuario.getId());

		return ResponseEntity.ok(mensajes);
	}
}