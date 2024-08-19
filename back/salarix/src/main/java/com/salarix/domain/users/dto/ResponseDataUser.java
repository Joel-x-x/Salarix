package com.salarix.domain.users.dto;

import com.salarix.domain.users.UserEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ResponseDataUser(
        UUID id,
        String firstname,
        String lastname,
        String email,
        String identification,
        Boolean sex,
        String address,
        LocalDate birthday,
        String phone,
        String role,
        LocalDateTime created,
        LocalDateTime updated,
        Boolean status
) {
    public ResponseDataUser(UserEntity user) {
        this(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getIdentification(),
                user.getSex(),
                user.getAddress(),
                user.getBirthday(),
                user.getPhone(),
                user.getRole().name(),
                user.getCreated(),
                user.getUpdated(),
                user.getStatus()
        );
    }
}
