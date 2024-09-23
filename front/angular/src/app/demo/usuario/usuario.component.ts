import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { IUsuario, IUsuarioActualizar } from '../interfaces/IUsuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  usuarios: IUsuario[] = [];
  usuarioSeleccionado: IUsuario | null = null;
  modalVisible: boolean = false;
  esNuevoUsuario: boolean = true;

  // Formulario de usuario
  formularioUsuario = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required], // Se puede manejar la validación de contraseñas aquí
    role: ['', Validators.required],
    identification: [''],
    sex: [null],
    address: [''],
    birthday: [''],
    phone: [''],
    codeEmployee: ['']
  });

  // Roles posibles
  roles: string[] = ['ADMINISTRADOR', 'EMPLEADO', 'CONTADOR'];

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerTodosUsuarios();
  }

  // Obtener todos los usuarios
  obtenerTodosUsuarios(): void {
    this.usuarioService.todos().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error')
    });
  }

  // Crear o actualizar usuario
  grabar(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
    }

    const usuario: IUsuario = {
      id: this.usuarioSeleccionado?.id || '', // Asigna el ID si existe o una cadena vacía
      firstname: this.formularioUsuario.get('firstname')?.value || '',
      lastname: this.formularioUsuario.get('lastname')?.value || '',
      email: this.formularioUsuario.get('email')?.value || '',
      password: this.formularioUsuario.get('password')?.value || '',
      role: this.formularioUsuario.get('role')?.value || '',
    };

    if (this.esNuevoUsuario) {
      this.usuarioService.insertar(usuario).subscribe({
        next: () => {
          Swal.fire('Usuario', 'Usuario creado con éxito.', 'success');
          this.obtenerTodosUsuarios();
          this.closeModal();
        },
        error: (error) => Swal.fire('Error', 'No se pudo crear el usuario', 'error')
      });
    } else {
      usuario.id = this.usuarioSeleccionado?.id || '';
        this.usuarioService.actualizarUsuario(usuario).subscribe({
        next: () => {
          Swal.fire('Usuario', 'Usuario actualizado con éxito.', 'success');
          this.obtenerTodosUsuarios();
          this.closeModal();
        },
        error: (error) => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
      });
    }
  }

  // Abrir modal para nuevo usuario
  openModal(): void {
    this.formularioUsuario.reset();
    this.usuarioSeleccionado = null;
    this.esNuevoUsuario = true;
    this.modalVisible = true;
  }

  // Abrir modal para editar usuario
  openModalEditar(usuario: IUsuario): void {
    this.usuarioSeleccionado = usuario;
    this.formularioUsuario.patchValue({
      firstname: usuario.firstname,
      lastname: usuario.lastname,
      email: usuario.email,
      role: usuario.role,
    });

    // Desactivar la validación de password en modo edición
    this.formularioUsuario.get('password')?.clearValidators();
    this.formularioUsuario.get('password')?.updateValueAndValidity();

    this.esNuevoUsuario = false;
    this.modalVisible = true;
  }

  // Cerrar modal
  closeModal(): void {
    this.modalVisible = false;
  }

  // Eliminar usuario
  eliminarUsuario(id: string): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Usuario', 'Usuario eliminado con éxito.', 'success');
            this.obtenerTodosUsuarios();
          },
          error: (error) => Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
        });
      }
    });
  }
}
