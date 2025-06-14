package com.example.sportter.service;

import com.example.sportter.dto.CrearEquipoDTO;
import com.example.sportter.dto.EquipoConMiembrosDTO;
import com.example.sportter.model.CategoriaDeporte;
import com.example.sportter.model.Equipo;
import com.example.sportter.model.Miembro;
import com.example.sportter.model.Usuario;
import com.example.sportter.repository.CategoriaDeporteRepository;
import com.example.sportter.repository.EquipoRepository;
import com.example.sportter.repository.MiembroRepository;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private MiembroRepository miembroRepository;
    
    @Autowired
    private CategoriaDeporteRepository categoriaDeporteRepository;

    @Transactional(readOnly = true)
    public List<EquipoConMiembrosDTO> getEquiposConMiembrosParaUsuario(Long userId) {
        return equipoRepository.findEquiposConMiembrosByUsuario(userId);
    }

    @Transactional(readOnly = true)
    public List<EquipoConMiembrosDTO> getEquiposComunidadConMiembros(Long userId) {
        return equipoRepository.findEquiposComunidadConMiembros(userId);
    }

    @Transactional
    public Equipo crearEquipo(CrearEquipoDTO equipoDTO, Long creadorId) {
        // Obtener la categoría de deporte
        CategoriaDeporte categoriaDeporte = categoriaDeporteRepository.findById(equipoDTO.getCategoriaDeporteId())
                .orElseThrow(() -> new RuntimeException("Categoría de deporte no encontrada"));

        // Crear el equipo
        Equipo equipo = new Equipo();
        equipo.setNombre(equipoDTO.getNombre());
        equipo.setDescripcion(equipoDTO.getDescripcion());
        equipo.setCategoriaDeporte(categoriaDeporte);
        equipo.setImagenUrl(equipoDTO.getImagenUrl());
        
        // Asignar creador
        Usuario creador = new Usuario();
        creador.setId(creadorId);
        equipo.setCreador(creador);

        // Guardar el equipo
        Equipo equipoGuardado = equipoRepository.save(equipo);

        // Añadir al creador como miembro
        añadirMiembro(equipoGuardado.getId(), creadorId);

        return equipoGuardado;
    }

    @Transactional
    public void añadirMiembro(Long equipoId, Long usuarioId) {
        if (!miembroRepository.existsByEquipoIdAndUsuarioId(equipoId, usuarioId)) {
            Equipo equipo = new Equipo();
            equipo.setId(equipoId);

            Usuario usuario = new Usuario();
            usuario.setId(usuarioId);

            Miembro miembro = new Miembro();
            miembro.setEquipo(equipo);
            miembro.setUsuario(usuario);

            miembroRepository.save(miembro);
        }
    }

    @Transactional
    public void eliminarMiembro(Long equipoId, Long usuarioId) {
        miembroRepository.deleteByEquipoIdAndUsuarioId(equipoId, usuarioId);
    }
}