package com.salarix.infra.error;

import java.util.List;

public record ErrorResponseDto(
        String status,
        List<String> errors
) {
}
