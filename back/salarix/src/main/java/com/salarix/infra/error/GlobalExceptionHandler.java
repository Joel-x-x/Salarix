package com.salarix.infra.error;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleError404() {
        return ResponseEntity.notFound().build();
    }
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> handleNullPointerException(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponseDto("400", new ArrayList<>(List.of(e.getMessage()))));
    }
    @ExceptionHandler(IntegrityValidation.class)
    public ResponseEntity<?> errorHandlerBusinessValidation(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponseDto("400", new ArrayList<>(List.of(e.getMessage()))));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleError400(MethodArgumentNotValidException e) {
        List<DataErrorValidation> dataErrorValidation = e.getFieldErrors().stream().map(DataErrorValidation::new).toList();
        return ResponseEntity.badRequest().body(dataErrorValidation);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDto("500", new ArrayList<>(List.of("Internal Server Error"))));
    }
    private record DataErrorValidation(String campo, String error) {
        public DataErrorValidation(FieldError fieldError) {
            this(fieldError.getField(), fieldError.getDefaultMessage());
        }
    }
}
