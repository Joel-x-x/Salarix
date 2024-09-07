import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DependentService } from '../../services/dependiente.service';
import Swal from 'sweetalert2';
import { IDependiente } from '../../interfaces/IDependiente';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../interfaces/IEmpleado';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-dependiente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './dependientes.component.html',
  styleUrls: ['./dependientes.component.scss']
})
export class DependienteComponent implements OnInit {
  dependientes: IDependiente[] = [];
  dependienteSeleccionado: IDependiente | null = null;
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  busquedaEmpleado: string = '';
  isModalVisible: boolean = false;
  esNuevoDependiente: boolean = true;
  mostrarTablaEmpleados: boolean = false;
  empleadoSeleccionado: Empleado | null = null;

  formDependiente = new FormGroup({
    id: new FormControl(''), // Añadido para manejo de IDs en ediciones
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    relation: new FormControl('', Validators.required),
    disability: new FormControl(0, Validators.required), // Por defecto sin discapacidad
    birthday: new FormControl('', Validators.required), // Asegúrate de ingresar un valor de fecha válido
    status: new FormControl(1), // Por defecto activo
    id_user: new FormControl('', Validators.required) // ID del usuario asociado
  });

  constructor(
    private dependentService: DependentService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.obtenerDependientes();
    this.listarEmpleados();
  }

  // Listar todos los dependientes
  obtenerDependientes(): void {
    this.dependentService.todos().subscribe({
      next: (data) => this.dependientes = data,
      error: (error) => console.error('Error al obtener los dependientes', error)
    });
  }

  // Listar todos los empleados
  listarEmpleados(): void {
    this.empleadoService.todos().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
      },
      error: (error) => console.error('Error al obtener los empleados', error)
    });
  }

  // Filtrar empleados por búsqueda
  filtrarEmpleados(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.firstname.toLowerCase().includes(this.busquedaEmpleado.toLowerCase()) ||
      empleado.lastname.toLowerCase().includes(this.busquedaEmpleado.toLowerCase())
    );
  }

  // Seleccionar un empleado
  seleccionarEmpleado(empleado: Empleado): void {
    this.empleadoSeleccionado = empleado;
    this.formDependiente.patchValue({ id_user: empleado.id });
    this.mostrarTablaEmpleados = false;
  }

  // Alternar la tabla de empleados
  toggleEmpleadoTable(): void {
    this.mostrarTablaEmpleados = !this.mostrarTablaEmpleados;
    if (this.mostrarTablaEmpleados) {
      this.listarEmpleados();
      this.filtrarEmpleados();
    }
  }

  // Abrir modal para crear o editar dependiente
  openModal(dependiente?: IDependiente): void {
    this.isModalVisible = true;
    this.esNuevoDependiente = !dependiente;

    if (dependiente) {
      this.dependienteSeleccionado = dependiente;
      this.formDependiente.patchValue({
        id: dependiente.id,
        name: dependiente.name,
        lastname: dependiente.lastname,
        relation: dependiente.relation,
        disability: dependiente.disability,
        birthday: dependiente.birthday,
        status: dependiente.status,
        id_user: dependiente.id_user
      });
      this.empleadoSeleccionado = this.empleados.find(e => e.id === dependiente.id_user) || null;
    } else {
      this.formDependiente.reset({
        disability: 0,
        status: 1
      });
      this.empleadoSeleccionado = null;
    }
  }

  // Cerrar modal
  closeModal(): void {
    this.isModalVisible = false;
    this.dependienteSeleccionado = null;
  }

  // Crear o actualizar dependiente
  grabar(): void {
    if (this.formDependiente.invalid) {
      this.formDependiente.markAllAsTouched();
      return;
    }

    const dependiente: IDependiente = {
      id: this.formDependiente.get('id')?.value ?? '',
      name: this.formDependiente.get('name')?.value ?? '',
      lastname: this.formDependiente.get('lastname')?.value ?? '',
      relation: this.formDependiente.get('relation')?.value ?? '',
      disability: this.formDependiente.get('disability')?.value ?? 0,
      birthday: this.formDependiente.get('birthday')?.value ?? '',
      status: this.formDependiente.get('status')?.value ? 1 : 0,
      id_user: this.formDependiente.get('id_user')?.value ?? ''
    };

    if (this.esNuevoDependiente) {
      console.log(dependiente);
      this.dependentService.insertar(dependiente).subscribe({
        next: () => {
          this.obtenerDependientes();
          this.closeModal();
          Swal.fire('Éxito', 'Dependiente creado exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error al crear el dependiente', error);
          Swal.fire('Error', 'No se pudo crear el dependiente', 'error');
        }
      });
    } else {
      this.dependentService.actualizar(dependiente).subscribe({
        next: () => {
          this.obtenerDependientes();
          this.closeModal();
          Swal.fire('Éxito', 'Dependiente actualizado exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar el dependiente', error);
          Swal.fire('Error', 'No se pudo actualizar el dependiente', 'error');
        }
      });
    }
  }

  // Eliminar dependiente
  eliminarDependiente(id: string): void {
    Swal.fire({
      title: '¿Está seguro de eliminar este dependiente? No lo podrás recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dependentService.eliminar(id).subscribe({
          next: () => {
            this.obtenerDependientes();
            Swal.fire('Eliminado', 'Dependiente eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el dependiente', error);
            Swal.fire('Error', 'No se pudo eliminar el dependiente', 'error');
          }
        });
      }
    });
  }
}
