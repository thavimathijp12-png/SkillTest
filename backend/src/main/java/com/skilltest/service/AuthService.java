package com.skilltest.service;

import com.skilltest.config.JwtUtil;
import com.skilltest.dto.AuthRequest;
import com.skilltest.dto.AuthResponse;
import com.skilltest.dto.RegisterRequest;
import com.skilltest.exception.BadRequestException;
import com.skilltest.exception.ResourceNotFoundException;
import com.skilltest.exception.UnauthorizedException;
import com.skilltest.model.Student;
import com.skilltest.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(StudentRepository studentRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (studentRepository.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + req.getEmail() + " already exists");
        }

        String passwordHash = passwordEncoder.encode(req.getPassword());
        Student student = new Student(
                req.getName().trim(),
                req.getEmail().trim().toLowerCase(),
                passwordHash,
                "STUDENT"
        );
        student = studentRepository.save(student);

        String jwtToken = jwtUtil.generateToken(student.getId(), student.getName(), student.getEmail(), student.getRole());
        return new AuthResponse(student.getId(), student.getName(), student.getEmail(),
                student.getRole(), jwtToken, "Registration successful");
    }

    public AuthResponse login(AuthRequest req) {
        Student student = studentRepository.findByEmail(req.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), student.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String jwtToken = jwtUtil.generateToken(student.getId(), student.getName(), student.getEmail(), student.getRole());
        return new AuthResponse(student.getId(), student.getName(), student.getEmail(),
                student.getRole(), jwtToken, "Login successful");
    }

    public Student getProfile(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
    }

    public boolean validateJwtToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public Long getStudentIdFromJwt(String token) {
        return jwtUtil.extractStudentId(token);
    }
}

