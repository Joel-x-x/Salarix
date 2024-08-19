package com.salarix.controller;

import com.salarix.domain.users.Role;
import com.salarix.domain.users.UserEntity;
import com.salarix.domain.users.UserRepository;
import com.salarix.domain.users.dto.ResponseDataUser;
import com.salarix.domain.users.dto.SaveDataUser;
import com.salarix.domain.users.service.GenerateCodeEmployeeService;
import com.salarix.infra.error.SuccessfullyResponseDto;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

@RestController
@RequestMapping("api/v1/employees")
public class EmployeeController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private GenerateCodeEmployeeService generateCodeEmployeeService;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "El empleado se ha creado exitosamente."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    @PostMapping
    public ResponseEntity<SuccessfullyResponseDto> createEmployee(@RequestBody SaveDataUser saveDataUser, UriComponentsBuilder uriComponentsBuilder) {
        // Create userEntity
        UserEntity userEntity = userRepository.save(new UserEntity(saveDataUser, passwordEncoder.encode(saveDataUser.password()), generateCodeEmployeeService.generateCodeEmployee()));

        // Link uri for acceded to user data
        URI uri = uriComponentsBuilder.path("api/v1/employees/{id}").buildAndExpand(userEntity.getId()).toUri();

        return ResponseEntity.created(uri).body(new SuccessfullyResponseDto("201",
                "El empleado " + userEntity.getFirstname() + " se ha creado exitosamente."));
    }

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de empleados."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
//    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    public ResponseEntity<Page<ResponseDataUser>> listEmployees(@PageableDefault(size = Integer.MAX_VALUE, sort = {"firstname"}) Pageable pageable){
        return ResponseEntity.ok(userRepository.findByRole(Role.EMPLEADO,pageable).map(ResponseDataUser::new));
    }

}
