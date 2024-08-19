package com.salarix.domain.users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.web.PagedModel;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    UserDetails findByEmail(String email);
    Boolean existsByEmail(String email);
    @Query("SELECT MAX(u.codeEmployee) FROM UserEntity u")
    String findMaxCodeEmployee();
    @Query("SELECT u FROM UserEntity  u WHERE u.role <> 'EMPLEADO'")
    Page<UserEntity> findUsersNotRolEmpleado(Pageable pageable);
    Page<UserEntity> findByRole(Role role, Pageable pageable);

}
