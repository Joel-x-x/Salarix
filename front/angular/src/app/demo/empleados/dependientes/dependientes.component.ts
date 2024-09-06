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
  modalVisible: boolean = false;
  esNuevoDependiente: boolean = true;
  mostrarTablaEmpleados: boolean = false;
  empleadoSeleccionado: Empleado | null = null;

  formDependiente = new FormGroup({
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    relation: new FormControl('', Validators.required),
    disability: new FormControl(0, Validators.required), // Por defecto sin discapacidad
    birthday: new FormControl('', Validators.required), // Asegúrate de ingresar un valor de fecha válido
    status: new FormControl(1), // Por defecto activo
    id_user: new FormControl('', Validators.required), // ID del usuario asociado
  });

  constructor(private dependentService: DependentService, private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.obtenerDependientes();
    this.listarEmpleados();
  }

  obtenerDependientes(): void {
    this.dependentService.todos().subscribe({
      next: (data) => {
        this.dependientes = data;
      },
      error: (error) => {
        console.error('Error al obtener los dependientes', error);
      }
    });
  }

  listarEmpleados(): void {
    this.empleadoService.todos().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
      },
      error: (error) => console.error('Error al obtener los empleados', error)
    });
  }

  filtrarEmpleados(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.firstname.toLowerCase().includes(this.busquedaEmpleado.toLowerCase()) ||
      empleado.lastname.toLowerCase().includes(this.busquedaEmpleado.toLowerCase())
    );
  }

  seleccionarEmpleado(empleado: Empleado): void {
    this.empleadoSeleccionado = empleado;
    this.formDependiente.patchValue({ id_user: empleado.id });
    this.mostrarTablaEmpleados = false;
  }

  toggleEmpleadoTable(): void {
    this.mostrarTablaEmpleados = !this.mostrarTablaEmpleados;
    if (this.mostrarTablaEmpleados) {
      this.listarEmpleados();
    }
  }

  openModal(): void {
    this.modalVisible = true;
    this.esNuevoDependiente = true;
    this.formDependiente.reset({
      disability: 0, // Valor predeterminado
      status: 1 // Valor predeterminado
    });
    this.empleadoSeleccionado = null; // Reiniciar selección de empleado al abrir modal
  }

  openModalEditar(dependiente: IDependiente): void {
    this.modalVisible = true;
    this.esNuevoDependiente = false;
    this.dependienteSeleccionado = dependiente;
    this.formDependiente.patchValue({
      name: dependiente.name,
      lastname: dependiente.lastname,
      relation: dependiente.relation,
      disability: dependiente.disability,
      birthday: dependiente.birthday,
      status: dependiente.status,
      id_user: dependiente.id_user
    });

    // Asignar el empleado seleccionado basado en id_user
    this.empleadoSeleccionado = this.empleados.find(e => e.id === dependiente.id_user) || null;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.dependienteSeleccionado = null;
  }

  grabar(): void {
    if (this.formDependiente.valid) {
      const dependiente: IDependiente = {
        id: this.dependienteSeleccionado ? this.dependienteSeleccionado.id : '',
        name: this.formDependiente.get('name')?.value || '',
        lastname: this.formDependiente.get('lastname')?.value || '',
        relation: this.formDependiente.get('relation')?.value || '',
        disability: this.formDependiente.get('disability')?.value || 0,
        birthday: this.formDependiente.get('birthday')?.value || '',
        status: this.formDependiente.get('status')?.value ? 1 : 0,
        id_user: this.formDependiente.get('id_user')?.value || ''
      };

      if (this.esNuevoDependiente) {
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
  }

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
