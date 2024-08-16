package com.salarix.domain.usuarios;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record ListDataUser(
        UUID id,
        @NotNull
        String firstname,
        @NotNull
        String lastname,
        @NotNull
        @Email
        String email,
        @NotNull
        Role role,
        @NotNull
        String identification,
        Boolean sex,
        String address,
        LocalDateTime birthday,
        String phone,
        String codeEmployee,
        LocalDateTime created,
        LocalDateTime updated,
        @NotNull
        Boolean status
) {
        public ListDataUser(UserEntity user) {
                this(
                        user.getId(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getRole(),
                        user.getIdentification(),
                        user.getSex(),
                        user.getAddress(),
                        user.getBirthday(),
                        user.getPhone(),
                        user.getCodeEmployee(),
                        user.getCreated(),
                        user.getUpdated(),
                        user.getStatus()
                );
        }
}
