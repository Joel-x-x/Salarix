package com.salarix.domain.usuarios.autenticacion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthDataUser(
        @Email
        String email,
        @NotBlank
        String password) {
}
