package com.salarix.infra.security;

import com.salarix.domain.users.UserEntity;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.secret}")
    private String apiSecret;

    public String generarToken(UserEntity userEntity) {

        try {
            Algorithm algorithm = Algorithm.HMAC256(apiSecret);

            return JWT.create()
                    .withIssuer("salarix")
                    .withSubject(userEntity.getEmail())
                    .withClaim("id", userEntity.getId().toString())
                    .withClaim("rol", userEntity.getRole().name())
                    .withExpiresAt(generarTiempoExpiracion())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException();
        }

    }

    public String getSubject(String token) {
        DecodedJWT verifier = null;

        try {
            Algorithm algorithm = Algorithm.HMAC256(apiSecret);

            verifier = JWT.require(algorithm)
                    .withIssuer("salarix")
                    .build()
                    .verify(token);

            verifier.getSubject();

        } catch (JWTVerificationException exception){
            System.out.println(exception.toString());
        }

        if (verifier != null) {
            String subject = verifier.getSubject();
            if (subject != null) {
                return subject;
            }
        }

        throw new ValidationException("Token invalido o expirado");

    }

    private Instant generarTiempoExpiracion() {
        return LocalDateTime.now().plusHours(240).toInstant(ZoneOffset.of("-05:00"));
    }
}