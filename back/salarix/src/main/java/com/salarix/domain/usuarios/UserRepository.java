package com.salarix.domain.usuarios;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    UserDetails findByEmail(String email);

    @Query("SELECT MAX(u.codeEmployee) FROM UserEntity u")
    String findMaxCodeEmployee();

    @Query("""
        select u from UserEntity u where u.rol <> 'SOCIO' and u.superadmin = false
    """)
    Page<UserEntity> findUsuariosRolSocio(Pageable pageable);

    @Query("""
        select u from UserEntity u where u.rol = 'SOCIO'
    """)
    Page<UserEntity> findUsuariosRolOnlySocio(Pageable pageable);
    UserEntity getUsuarioById(UUID id);

    @Query("""
        select u from UserEntity u where u.rol = 'SOCIO' and u.estado = true
    """)
    Page<UserEntity> findUsuariosRolOnlySocioActivo(Pageable pageable);

    @Query("""
        select count(u) from UserEntity u where u.rol = 'SOCIO' and u.estado = true
    """)
    int findTotalUsuariosRolOnlySocios();

    @Query("""
        select u from UserEntity u where u.rol = 'SOCIO' and u.estado = true
        and u.fechaCreacion between  :fechaInicio and :fechaFin
    """)
    Page<UserEntity> findUsuariosRolOnlySocioActivoRangoFecha(
           LocalDateTime fechaInicio,
             LocalDateTime fechaFin,
            Pageable pageable
    );

    Boolean existsUsuarioByEmail(String email);

}
