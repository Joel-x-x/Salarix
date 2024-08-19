package com.salarix.controller;

import com.salarix.domain.users.SaveDataUser;
import com.salarix.domain.users.UserEntity;
import com.salarix.domain.users.UserRepository;
import com.salarix.infra.error.SuccessfullyResponseDto;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("api/v1/users")
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "El usuario se ha creado exitosamente."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    @PostMapping
    public ResponseEntity<SuccessfullyResponseDto> createUser(@RequestBody SaveDataUser saveDataUser, UriComponentsBuilder uriComponentsBuilder) {
        // Create userEntity
        UserEntity userEntity = userRepository.save(new UserEntity(saveDataUser, passwordEncoder.encode(saveDataUser.password())));

        // Link uri for acceded to user data
        URI uri = uriComponentsBuilder.path("api/v1/users/{id}").buildAndExpand(userEntity.getId()).toUri();

        return ResponseEntity.created(uri).body(new SuccessfullyResponseDto("201",
                "El usuario " + userEntity.getFirstname() + " se ha creado exitosamente."));
    }
}
