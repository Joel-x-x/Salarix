import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service'; // Ajusta la ruta si es necesario
import { Empleado } from '../../interfaces/IEmpleado';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { IUsuarioActualizar } from '../../interfaces/IUsuario';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [RouterLink, SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadoSeleccionado: Empleado | null = null;
  modalVisible: boolean = false;
  esNuevoEmpleado: boolean = true;

  // Form
  formEmpleado = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    identification: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  constructor(private empleadoService: EmpleadoService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listarEmpleados();
  }

  // Listar todos los empleados
  listarEmpleados(): void {
    this.empleadoService.todos().subscribe({
      next: (data) => this.empleados = data,
      error: (error) => console.error('Error al obtener los empleados', error)
    });
  }

  // Crear o actualizar un empleado
  grabar(): void {
    if (this.formEmpleado.invalid) {
      this.formEmpleado.markAllAsTouched();
      return;
    }

    const empleado: Empleado = {
      id: this.empleadoSeleccionado?.id || '', // Asigna ID si existe o cadena vacía
      firstname: this.formEmpleado.get('firstname')?.value || '', // Asegura que siempre sea string
      lastname: this.formEmpleado.get('lastname')?.value || '',
      password: this.formEmpleado.get('password')?.value || '',
      email: this.formEmpleado.get('email')?.value || '',
      identification: this.formEmpleado.get('identification')?.value || '',
      sex: this.formEmpleado.get('sex')?.value === 'true' ? 1 : 0, // Maneja el tipo boolean
      address: this.formEmpleado.get('address')?.value || '',
      birthday: this.formEmpleado.get('birthday')?.value || '',
      phone: this.formEmpleado.get('phone')?.value || '',
    };

    if (this.esNuevoEmpleado) {
      this.empleadoService.insertar(empleado).subscribe({
        next: () => {
          Swal.fire('Empleado', 'Empleado creado con éxito.', 'success');
          this.listarEmpleados();
          this.closeModal();
        },
        error: (error) => console.error('Error al insertar el empleado', error)
      });
    } else {
      empleado.id = this.empleadoSeleccionado?.id;
      empleado.sex = 1;
      const usuario: IUsuarioActualizar = this.convertirAUsuario(empleado);

      console.log(usuario);
      this.usuarioService.actualizarUsuario(usuario).subscribe({
        next: () => {
          Swal.fire('Empleado', 'Empleado actualizado con éxito.', 'success');
          this.listarEmpleados();
          this.closeModal();
        },
        error: (error) => console.error('Error al actualizar el empleado', error)
      });
    }
  }

  // Función para convertir Empleado a Usuario
convertirAUsuario(empleado: Empleado): IUsuarioActualizar {
  return {
    id: empleado.id ?? '',
    firstname: empleado.firstname,
    lastname: empleado.lastname,
    email: empleado.email,
    identification: empleado.identification,
    sex: empleado.sex,
    address: empleado.address,
    birthday: empleado.birthday,
    phone: empleado.phone
  };
}

  // Abrir el modal para nuevo empleado
  openModal(): void {
    this.formEmpleado.reset();
    this.empleadoSeleccionado = null;
    this.esNuevoEmpleado = true;
    this.modalVisible = true;
  }

  // Abrir el modal para editar empleado
  openModalEditar(empleado: Empleado): void {
    this.empleadoSeleccionado = empleado;
    this.formEmpleado.patchValue({
      firstname: empleado.firstname,
      lastname: empleado.lastname,
      email: empleado.email,
      identification: empleado.identification,
      sex: empleado.sex ? 'true' : 'false', // Si sex es boolean, conviértelo a string 'true' o 'false'
      address: empleado.address,
      birthday: empleado.birthday,
      phone: empleado.phone
    });

    // Desactivar validación del campo password en modo edición
    this.formEmpleado.get('password')?.clearValidators(); // Limpia las validaciones
    this.formEmpleado.get('password')?.updateValueAndValidity(); // Actualiza el estado del campo

    this.esNuevoEmpleado = false;
    this.modalVisible = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.modalVisible = false;
  }

  // Eliminar empleado
  eliminarEmpleado(id: string): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea eliminar este empleado?',
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
            Swal.fire('Empleado', 'Empleado eliminado con éxito.', 'success');
            this.listarEmpleados();
          },
          error: (error) => console.error('Error al eliminar el empleado', error)
        });
      }
    });
  }
}
