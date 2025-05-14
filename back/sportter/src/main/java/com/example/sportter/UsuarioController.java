package com.example.sportter;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @GetMapping("/saludo")
    public String saludar() {
        return "¡Hola desde Spring Boot!";
    }
}
