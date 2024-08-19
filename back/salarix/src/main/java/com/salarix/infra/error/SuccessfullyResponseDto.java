package com.salarix.infra.error;

public record SuccessfullyResponseDto(
        String status,
        String message
) {
}
