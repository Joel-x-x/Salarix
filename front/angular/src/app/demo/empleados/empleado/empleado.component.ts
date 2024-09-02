import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service'; // Ajusta la ruta si es necesario
import { Empleado } from '../../interfaces/IEmpleado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadoSeleccionado: Empleado | null = null;
  modalVisible: boolean = false;
  esNuevoEmpleado: boolean = true;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.listarEmpleados();
  }

  // Listar todos los empleados
  listarEmpleados(): void {
    this.empleadoService.todos().subscribe(
      (data) => this.empleados = data,
      (error) => console.error('Error al obtener los empleados', error)
    );
  }

  // Obtener un empleado por ID
  obtenerEmpleado(id: number): void {
    this.empleadoService.uno(id).subscribe(
      (data) => this.empleadoSeleccionado = data,
      (error) => console.error('Error al obtener el empleado', error)
    );
  }

  // Crear o actualizar un empleado
  guardarEmpleado(empleado: Empleado): void {
    if (this.esNuevoEmpleado) {
      this.empleadoService.insertar(empleado).subscribe(
        (response) => {
          Swal.fire('Empleado', 'Empleado creado con éxito.', 'success');
          this.listarEmpleados();
          this.closeModal();
        },
        (error) => console.error('Error al insertar el empleado', error)
      );
    } else {
      this.empleadoService.actualizar(empleado).subscribe(
        (response) => {
          Swal.fire('Empleado', 'Empleado actualizado con éxito.', 'success');
          this.listarEmpleados();
          this.closeModal();
        },
        (error) => console.error('Error al actualizar el empleado', error)
      );
    }
  }

  // Abrir el modal para nuevo empleado
  openModal(): void {
    this.empleadoSeleccionado = {
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
  eliminarEmpleado(id: number): void {
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
        this.empleadoService.eliminar(id).subscribe(
          () => {
            Swal.fire('Empleado', 'Empleado eliminado con éxito.', 'success');
            this.listarEmpleados();
          },
          (error) => console.error('Error al eliminar el empleado', error)
        );
      }
    });
  }
}
