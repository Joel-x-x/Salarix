package com.salarix.domain.usuarios;

import com.salarix.domain.usuarios.service.GenerateCodeEmployeeService;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Builder
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "CHAR(36)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID id;

    private String firstname;
    private String lastname;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String identification;
    private Boolean sex;
    private String address;
    private LocalDateTime birthday;
    private String phone;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String codeEmployee;
    private LocalDateTime created;
    private LocalDateTime updated;
    private Boolean status;

    // Assign a single role
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
    }

    // Save employee
    public UserEntity(SaveDataUser saveDataUser, String password, String codeEmployee){
        this.firstname = saveDataUser.firstname();
        this.lastname = saveDataUser.lastname();
        this.email = saveDataUser.email();
        this.password = saveDataUser.password();
        this.identification = saveDataUser.identification();
        this.birthday = saveDataUser.birthday();
        this.sex = saveDataUser.sex();
        this.address = saveDataUser.address();
        this.phone = saveDataUser.phone();
        this.codeEmployee = codeEmployee;
        this.created = LocalDateTime.now();
        this.status = true;
        this.role = Role.EMPLEADO;
    }

    public UserEntity(SaveDataUser saveDataUser, String password){
        this.firstname = saveDataUser.firstname();
        this.lastname = saveDataUser.lastname();
        this.email = saveDataUser.email();
        this.password = password;
        this.created = LocalDateTime.now();
        this.status = true;
        this.role = saveDataUser.role();
    }

    public void updateUser(UpdateDataUser updateDataUser) {
        if(updateDataUser.firstname() != null) {
            this.firstname = updateDataUser.firstname();
        }

        if(updateDataUser.email() != null) {
            this.email = updateDataUser.email();
        }

        if(updateDataUser.lastname() != null) {
            this.lastname = updateDataUser.lastname();
        }

        if(updateDataUser.role() != null) {
            this.role = updateDataUser.role();
        }
    }

    public void updatePartnerData(UpdateDataUser updateDataUser) {
        if(updateDataUser.firstname() != null) {
            this.firstname = updateDataUser.firstname();
        }

        if(updateDataUser.lastname() != null) {
            this.lastname = updateDataUser.lastname();
        }

        if(updateDataUser.identification() != null) {
            this.identification = updateDataUser.identification();
        }

        if(updateDataUser.birthday() != null) {
            this.birthday = updateDataUser.birthday();
        }

        if(updateDataUser.address() != null) {
            this.address = updateDataUser.address();
        }

        if(updateDataUser.phone() != null) {
            this.phone = updateDataUser.phone();
        }

        if(updateDataUser.sex() != null) {
            this.sex = updateDataUser.sex();
        }
    }

    public void toggleStatus() {
        this.status = !this.status;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status;
    }
}
