package com.salarix.controller;

import com.salarix.domain.users.dto.ResponseDataUser;
import com.salarix.domain.users.UserEntity;
import com.salarix.domain.users.UserRepository;
import com.salarix.domain.users.dto.SaveDataUser;
import com.salarix.domain.users.dto.UpdateDataUser;
import com.salarix.infra.error.SuccessfullyResponseDto;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/users")
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "El usuario se ha creado exitosamente."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    public ResponseEntity<SuccessfullyResponseDto> createUser(@RequestBody SaveDataUser saveDataUser, UriComponentsBuilder uriComponentsBuilder) {
        // Create userEntity
        UserEntity userEntity = userRepository.save(new UserEntity(saveDataUser, passwordEncoder.encode(saveDataUser.password())));

        // Link uri for acceded to user data
        URI uri = uriComponentsBuilder.path("api/v1/users/{id}").buildAndExpand(userEntity.getId()).toUri();

        return ResponseEntity.created(uri).body(new SuccessfullyResponseDto("201",
                "El usuario " + userEntity.getFirstname() + " se ha creado exitosamente."));
    }

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios exceptuando a los que tengan el rol EMPLEADO"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    public ResponseEntity<Page<ResponseDataUser>> listUsers(@PageableDefault(size = Integer.MAX_VALUE, sort = {"firstname"}) Pageable pageable){
        return ResponseEntity.ok(userRepository.findUsersNotRolEmpleado(pageable).map(ResponseDataUser::new));
    }

    @PutMapping
    @Transactional
    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Datos actualizados exitosamente."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    public ResponseEntity<SuccessfullyResponseDto> updateGym(@RequestBody @Valid UpdateDataUser updateDataUser) {
        UserEntity userEntity = userRepository.findById(updateDataUser.id()).get();

        userEntity.updateData(updateDataUser);

        return ResponseEntity.ok(new SuccessfullyResponseDto("200", "Datos actualizados exitosamente."));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    public ResponseEntity<SuccessfullyResponseDto> changeStatus(@PathVariable UUID id) {
        UserEntity userEntity = userRepository.findById(id).get();

        userEntity.toggleStatus();

        return ResponseEntity.ok(new SuccessfullyResponseDto("200", "Estado cambiado exitosamente."));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    public ResponseEntity<ResponseDataUser> getUser(@PathVariable UUID id){
        UserEntity userEntity = userRepository.findById(id).get();
        return  ResponseEntity.ok(new ResponseDataUser(userEntity));
    }
}
