package com.salarix.controller;

import com.salarix.domain.users.UserEntity;
import com.salarix.domain.users.UserRepository;
import com.salarix.domain.users.autenticacion.LoginDataUser;
import com.salarix.domain.users.dto.SaveDataUser;
import com.salarix.infra.error.SuccessfullyResponseDto;
import com.salarix.infra.security.TokenDataJwt;
import com.salarix.infra.security.TokenService;
import com.salarix.infra.error.IntegrityValidation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("api/v1/auth/")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token."),
            @ApiResponse(responseCode = "400", description = "Credeciales incorrectas."),
            @ApiResponse(responseCode = "400", description = "Email no existe, cree una cuenta."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    @PostMapping("/login")
    public ResponseEntity<TokenDataJwt> login(@RequestBody @Valid LoginDataUser loginDataUser) {
        // Validate confirmed email
        if(!userRepository.existsByEmail(loginDataUser.email())) {
            throw new IntegrityValidation("Email no existe, cree una cuenta.");
        }

        Authentication tokenAuth = new UsernamePasswordAuthenticationToken(loginDataUser.email(),
                loginDataUser.password());
        try {
            var authenticatedUser = authenticationManager.authenticate(tokenAuth);
            var tokenJWT = tokenService.generarToken((UserEntity) authenticatedUser.getPrincipal());

            return ResponseEntity.ok(new TokenDataJwt(tokenJWT));
        } catch (Exception e) {
            throw new IntegrityValidation("Credenciales incorrectas.");
        }
    }

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('SUPERADMINISTRADOR','ADMINISTRADOR')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "El usuario se ha registrado exitosamente."),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    })
    public ResponseEntity<SuccessfullyResponseDto> register(@RequestBody SaveDataUser saveDataUser, UriComponentsBuilder uriComponentsBuilder) {
        // Create userEntity
        UserEntity userEntity = userRepository.save(new UserEntity(saveDataUser, passwordEncoder.encode(saveDataUser.password())));

        // Link uri for acceded to user data
        URI uri = uriComponentsBuilder.path("api/v1/users/{id}").buildAndExpand(userEntity.getId()).toUri();

        return ResponseEntity.created(uri).body(new SuccessfullyResponseDto("201",
                "El usuario " + userEntity.getFirstname() + " se ha creado exitosamente."));
    }
}
