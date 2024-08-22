package com.salarix.domain.users.autenticacion;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public record RespondDataUser(
        UUID id,
        String nombre,
        String apellido,
        String email,
        Collection<? extends GrantedAuthority> rol

) {
//        public RespondDataUser(Usuario usuario) {
//                this(usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getAuthorities());
//        }
}
