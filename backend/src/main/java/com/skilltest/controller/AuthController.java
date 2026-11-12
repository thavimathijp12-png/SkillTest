package com.skilltest.controller;

import com.skilltest.dto.AuthRequest;
import com.skilltest.dto.AuthResponse;
import com.skilltest.dto.RegisterRequest;
import com.skilltest.model.Student;
import com.skilltest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse response = authService.register(req);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Missing or invalid Bearer token"));
        }
        String token = authHeader.substring(7).trim();
        if (!authService.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Token is invalid or expired"));
        }
        Long studentId = authService.getStudentIdFromJwt(token);
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Unable to extract claims from token"));
        }
        Student student = authService.getProfile(studentId);
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "studentId", student.getId(),
                "name", student.getName(),
                "email", student.getEmail(),
                "role", student.getRole()
        ));
    }

    @GetMapping("/profile/{studentId}")
    public ResponseEntity<Student> getProfile(@PathVariable Long studentId) {
        Student student = authService.getProfile(studentId);
        // hide password hash from JSON response
        student.setPasswordHash("[PROTECTED]");
        return ResponseEntity.ok(student);
    }
}

