
package com.employeeLeaveManagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationTime;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationTime
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expirationTime = expirationTime;
    }

    public String generate(String email, String role) {

        Date currentTime = new Date();

        Date expirationDate = new Date(
                currentTime.getTime() + expirationTime
        );

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(currentTime)
                .expiration(expirationDate)
                .signWith(secretKey)
                .compact();
    }

    public Claims parse(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
