package com.salarix.domain.usuarios;

import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateDataUser(
        UUID id,
        String firstname,
        String lastname,
        String email,
        String identification,
        Boolean sex,
        String address,
        LocalDateTime birthday,
        String phone,
        Role role
) {}
