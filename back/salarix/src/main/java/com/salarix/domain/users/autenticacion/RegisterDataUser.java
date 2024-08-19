package com.salarix.domain.users.autenticacion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterDataUser(
        @Email
        @NotBlank
        @Size(max = 100)
        String email,
        @NotBlank
        String firstname,
        @NotBlank
        String lastname,
        @NotBlank
        String password,
        @NotNull
        String rol
) {
}
