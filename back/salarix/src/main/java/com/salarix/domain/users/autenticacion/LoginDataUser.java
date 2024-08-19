package com.salarix.domain.users.autenticacion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDataUser(
        @Email
        String email,
        @NotBlank
        String password) {
}
