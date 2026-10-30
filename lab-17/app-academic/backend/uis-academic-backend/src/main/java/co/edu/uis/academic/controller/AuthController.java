package co.edu.uis.academic.controller;

import co.edu.uis.academic.dto.JwtResponse;
import co.edu.uis.academic.dto.LoginRequest;
import co.edu.uis.academic.repository.UserRepository;
import co.edu.uis.academic.security.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(loginRequest.getUsername());

        var user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

        JwtResponse jwtResponse = JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRole().name())
                .build();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Inicio de sesión exitoso");
        response.put("data", jwtResponse);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "API de Gestión Académica UIS funcionando correctamente");
        response.put("status", "UP");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
}