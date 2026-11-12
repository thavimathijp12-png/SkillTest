package com.skilltest;

import com.skilltest.dto.AuthRequest;
import com.skilltest.dto.AuthResponse;
import com.skilltest.dto.RegisterRequest;
import com.skilltest.exception.BadRequestException;
import com.skilltest.exception.UnauthorizedException;
import com.skilltest.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void testRegisterAndLoginSuccess() {
        String email = "john.doe." + System.currentTimeMillis() + "@example.com";
        RegisterRequest registerReq = new RegisterRequest("John Doe", email, "secret123");
        AuthResponse regResponse = authService.register(registerReq);

        assertNotNull(regResponse.getId());
        assertEquals("John Doe", regResponse.getName());
        assertEquals(email, regResponse.getEmail());

        // Test Login
        AuthRequest loginReq = new AuthRequest(email, "secret123");
        AuthResponse loginResponse = authService.login(loginReq);

        assertNotNull(loginResponse.getToken());
        assertTrue(loginResponse.getToken().split("\\.").length == 3, "Token should be a standard 3-part JWT");
        assertTrue(authService.validateJwtToken(loginResponse.getToken()), "JWT should be cryptographically valid");
        assertEquals(regResponse.getId(), authService.getStudentIdFromJwt(loginResponse.getToken()));
        assertEquals(regResponse.getId(), loginResponse.getId());
    }

    @Test
    void testDuplicateEmailRegistrationThrowsException() {
        String email = "duplicate." + System.currentTimeMillis() + "@example.com";
        authService.register(new RegisterRequest("User One", email, "password123"));

        assertThrows(BadRequestException.class, () -> {
            authService.register(new RegisterRequest("User Two", email, "password456"));
        });
    }

    @Test
    void testInvalidPasswordLoginThrowsException() {
        String email = "wrongpass." + System.currentTimeMillis() + "@example.com";
        authService.register(new RegisterRequest("User One", email, "correctPassword"));

        assertThrows(UnauthorizedException.class, () -> {
            authService.login(new AuthRequest(email, "incorrectPassword"));
        });
    }
}

