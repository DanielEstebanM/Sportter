package com.example.sportter.model;

import java.util.ArrayList;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<Publicacion> publicaciones = new ArrayList<>();
    
    
    @JsonProperty("nombreUsuario")
    @Column(name = "nombre_usuario") // Cambiado de nombre.usuario a nombre_usuario
    private String nombreUsuario;

    @JsonProperty("correoElectronico")
    @Column(name = "correo_electronico", unique = true)
    private String correoElectronico;

    @JsonProperty("contrasena")
    @Column(name = "contrasena") // Añadida anotación @Column
    private String contrasena;
   

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico= correoElectronico;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

	public Object getUsername() {
		// TODO Auto-generated method stub
		return null;
	}

}
