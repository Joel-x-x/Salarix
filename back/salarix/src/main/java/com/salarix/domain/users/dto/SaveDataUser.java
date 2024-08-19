package com.salarix.domain.users.dto;

import com.salarix.domain.users.Role;

import java.time.LocalDate;

public record SaveDataUser(
        String firstname,
        String lastname,
        String email,
        String password,
        String identification,
        Boolean sex,
        String address,
        LocalDate birthday,
        String phone,
        String codeEmployee,
        Role role
) {}
