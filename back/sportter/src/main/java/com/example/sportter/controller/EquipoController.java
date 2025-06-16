package com.example.sportter.controller;

import com.example.sportter.dto.CrearEquipoDTO;
import com.example.sportter.dto.EquipoConMiembrosDTO;
import com.example.sportter.model.CategoriaDeporte;
import com.example.sportter.model.Equipo;
import com.example.sportter.service.EquipoService;

import jakarta.validation.Valid;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    @Autowired
    private EquipoService equipoService;

    @GetMapping("/usuario/{userId}")
    public ResponseEntity<List<EquipoConMiembrosDTO>> getEquiposConMiembrosParaUsuario(
            @PathVariable Long userId) {
        List<EquipoConMiembrosDTO> equipos = equipoService.getEquiposConMiembrosParaUsuario(userId);
        return ResponseEntity.ok(equipos);
    }

    @GetMapping("/comunidad/{userId}")
    public ResponseEntity<List<EquipoConMiembrosDTO>> getEquiposComunidadConMiembros(
            @PathVariable Long userId) {
        List<EquipoConMiembrosDTO> equipos = equipoService.getEquiposComunidadConMiembros(userId);
        return ResponseEntity.ok(equipos);
    }

    @PostMapping
    public ResponseEntity<?> crearEquipo(@RequestBody @Valid CrearEquipoDTO equipoDTO, 
                                        @RequestParam Long creadorId) {
        try {
            Equipo nuevoEquipo = equipoService.crearEquipo(equipoDTO, creadorId);
            return ResponseEntity.ok(nuevoEquipo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{equipoId}/miembros")
    public ResponseEntity<Void> añadirMiembro(@PathVariable Long equipoId, 
                                             @RequestParam Long usuarioId) {
        equipoService.añadirMiembro(equipoId, usuarioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{equipoId}/miembros/{usuarioId}")
    public ResponseEntity<Void> eliminarMiembro(@PathVariable Long equipoId, @PathVariable Long usuarioId) {
        equipoService.eliminarMiembro(equipoId, usuarioId);
        return ResponseEntity.ok().build();
    }
}