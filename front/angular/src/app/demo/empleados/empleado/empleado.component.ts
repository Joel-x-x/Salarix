import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service'; // Ajusta la ruta si es necesario
import { Empleado } from '../../interfaces/IEmpleado';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

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

  constructor(private empleadoService: EmpleadoService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.listarEmpleados();
  }

  // Listar todos los empleados
  listarEmpleados() {
    this.empleadoService.todos().subscribe({
      next: (data) => this.empleados = data,
      error: (error) => console.error('Error al obtener los empleados', error)
    });
  }

  // Obtener un empleado por ID
  obtenerEmpleado(id: number): void {
    this.empleadoService.uno(id).subscribe({
      next: (data) => this.empleadoSeleccionado = data,
      error: (error) => console.error('Error al obtener el empleado', error)
    });
  }

  // Crear o actualizar un empleado
  // grabar(): void {
  //   if (this.esNuevoEmpleado) {
  //     this.empleadoService.insertar(empleado).subscribe({
  //       next: (response) => {
  //         Swal.fire('Empleado', 'Empleado creado con éxito.', 'success');
  //         this.listarEmpleados();
  //         this.closeModal();
  //       },
  //       error: (error) => console.error('Error al insertar el empleado', error)
  //     });
  //   } else {
  //     this.empleadoService.actualizar(empleado).subscribe({
  //       next: (response) => {
  //         Swal.fire('Empleado', 'Empleado actualizado con éxito.', 'success');
  //         this.listarEmpleados();
  //         this.closeModal();
  //       },
  //       error: (error) => console.error('Error al actualizar el empleado', error)
  //     });
  //   }
  // }

  // // Abrir el modal para nuevo empleado
  openModal(): void {
    this.empleadoSeleccionado = {
      id: '',
      firstname: '',
      lastname: '',
      password: '',
      email: '',
      identification: '',
      sex: true,
      address: '',
      birthday: '',
      phone: '',
      status: true
    };
    this.esNuevoEmpleado = true;
    this.modalVisible = true;
  }

  // Abrir el modal para editar empleado
  openModalEditar(empleado: Empleado): void {
    this.empleadoSeleccionado = { ...empleado };
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
        this.usuarioService.cambiarEstadoUsuario(id).subscribe({
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
