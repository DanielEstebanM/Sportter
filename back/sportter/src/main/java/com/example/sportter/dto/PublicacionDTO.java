package com.example.sportter.dto;

import java.time.LocalDateTime;

public class PublicacionDTO {
	private Long id;
	private String contenido;
	private LocalDateTime fechaHora;
	private String nombreUsuario;
	private String categoriaDeporte;

	// Constructor, Getters y Setters
	public PublicacionDTO(Long id, String contenido, LocalDateTime fechaHora, String nombreUsuario,
			String categoriaDeporte) {
		this.id = id;
		this.contenido = contenido;
		this.fechaHora = fechaHora;
		this.nombreUsuario = nombreUsuario;
		this.categoriaDeporte = categoriaDeporte;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public LocalDateTime getFechaHora() {
		return fechaHora;
	}

	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}

	public String getNombreUsuario() {
		return nombreUsuario;
	}

	public void setNombreUsuario(String nombreUsuario) {
		this.nombreUsuario = nombreUsuario;
	}

	public String getCategoriaDeporte() {
		return categoriaDeporte;
	}

	public void setCategoriaDeporte(String categoriaDeporte) {
		this.categoriaDeporte = categoriaDeporte;
	}
}