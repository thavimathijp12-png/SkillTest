package com.skilltest.config;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "SkillTest_Secure_Jwt_Secret_Key_2026_Smart_Skill_Assessment_Platform";
    private static final long EXPIRATION_TIME_SECONDS = 7 * 24 * 60 * 60; // 7 days

    public String generateToken(Long studentId, String name, String email, String role) {
        long now = System.currentTimeMillis() / 1000;
        long exp = now + EXPIRATION_TIME_SECONDS;

        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format(
                "{\"sub\":\"%s\",\"id\":%d,\"name\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                escapeJson(email), studentId, escapeJson(name), escapeJson(role), now, exp
        );

        String encodedHeader = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
        String encodedPayload = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String dataToSign = encodedHeader + "." + encodedPayload;

        String signature = sign(dataToSign, SECRET_KEY);
        return dataToSign + "." + signature;
    }

    public boolean validateToken(String token) {
        if (token == null || !token.contains(".")) {
            return false;
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String expectedSignature = sign(parts[0] + "." + parts[1], SECRET_KEY);
        if (!MessageDigest.isEqual(parts[2].getBytes(StandardCharsets.UTF_8), expectedSignature.getBytes(StandardCharsets.UTF_8))) {
            return false;
        }

        try {
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            long exp = extractLongClaim(payloadJson, "exp");
            long now = System.currentTimeMillis() / 1000;
            return exp > now;
        } catch (Exception e) {
            return false;
        }
    }

    public Long extractStudentId(String token) {
        if (!validateToken(token)) return null;
        try {
            String payloadJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
            return extractLongClaim(payloadJson, "id");
        } catch (Exception e) {
            return null;
        }
    }

    public String extractEmail(String token) {
        if (!validateToken(token)) return null;
        try {
            String payloadJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
            return extractStringClaim(payloadJson, "sub");
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data, String secret) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] signedBytes = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return base64UrlEncode(signedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error signing JWT", e);
        }
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private long extractLongClaim(String json, String claimName) {
        String pattern = "\"" + claimName + "\":";
        int idx = json.indexOf(pattern);
        if (idx == -1) return -1;
        int start = idx + pattern.length();
        int end = start;
        while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '-')) {
            end++;
        }
        return Long.parseLong(json.substring(start, end).trim());
    }

    private String extractStringClaim(String json, String claimName) {
        String pattern = "\"" + claimName + "\":\"";
        int idx = json.indexOf(pattern);
        if (idx == -1) return null;
        int start = idx + pattern.length();
        int end = json.indexOf("\"", start);
        if (end == -1) return null;
        return json.substring(start, end);
    }
}

