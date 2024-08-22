package com.salarix.domain.users.dto;

import com.salarix.domain.users.Role;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateDataUser(
        UUID id,
        String firstname,
        String lastname,
        String email,
        String identification,
        Boolean sex,
        String address,
        LocalDate birthday,
        String phone,
        Role role
) {}
