package com.salarix.domain.usuarios;

import java.time.LocalDateTime;

public record SaveDataUser(
        String firstname,
        String lastname,
        String email,
        String password,
        String identification,
        Boolean sex,
        String address,
        LocalDateTime birthday,
        String phone,
        String codeEmployee,
        Role role
) {}
