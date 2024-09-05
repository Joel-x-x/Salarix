import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/departamento.service';
import { UsuarioDepartamentoService } from '../../services/usuario-departamento.service';
import { EmpleadoService } from '../../services/empleado.service';
import { IDepartamento } from '../../interfaces/IDepartamento';
import { Empleado } from '../../interfaces/IEmpleado'; // Asegúrate de tener esta interfaz
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { IUsuarioDepartmento } from '../../interfaces/IUsuarioDepartamento';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [RouterLink, SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentoComponent implements OnInit {
  departamentos: IDepartamento[] = [];
  departamentoSeleccionado: IDepartamento | null = null;
  empleados: Empleado[] = []; // Lista de empleados para agregar
  empleadosFiltrados: Empleado[] = []; // Empleados filtrados según el buscador
  empleadosDepartamento: IUsuarioDepartmento[] = []; // Lista de empleados del departamento
  filtroEmpleado: string = ''; // Filtro para el buscador de empleados
  modalVisible: boolean = false;
  esNuevoDepartamento: boolean = true;
  agregarEmpleadoModalVisible: boolean = false;
  listarEmpleadosModalVisible: boolean = false;
  departamentoIdSeleccionado: string = '';

  formDepartamento = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(
    private departamentoService: DepartmentService,
    private usuarioDepartamentoService: UsuarioDepartamentoService,
    private empleadoService: EmpleadoService,
  ) { }

  ngOnInit(): void {
    this.obtenerDepartamentos();
    this.obtenerEmpleados(); // Obtener la lista de empleados al cargar la página
  }

  obtenerDepartamentos(): void {
    this.departamentoService.todos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (error) => {
        console.error('Error al obtener los departamentos', error);
      }
    });
  }

  obtenerEmpleados(): void {
    this.empleadoService.todos().subscribe({
      next: (data) => {
        this.empleados = data;
        this.filtrarEmpleados(); // Filtrar la lista inicial de empleados
      },
      error: (error) => {
        console.error('Error al obtener los empleados', error);
      }
    });
  }

  filtrarEmpleados(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.firstname.toLowerCase().includes(this.filtroEmpleado.toLowerCase())
    );
  }

  openModal(): void {
    this.modalVisible = true;
    this.esNuevoDepartamento = true;
    this.formDepartamento.reset();
  }

  openModalEditar(departamento: IDepartamento): void {
    this.modalVisible = true;
    this.esNuevoDepartamento = false;
    this.departamentoSeleccionado = departamento;
    this.formDepartamento.patchValue({
      name: departamento.name,
      description: departamento.description
    });
  }

  closeModal(): void {
    this.modalVisible = false;
    this.departamentoSeleccionado = null;
  }

  grabar(): void {
    if (this.formDepartamento.valid) {
      // Crear un objeto departamento basado en los valores del formulario
      const departamento: IDepartamento = {
        name: this.formDepartamento.get('name')?.value || '', // Valores del formulario
        description: this.formDepartamento.get('description')?.value || ''
      };
  
      // Si es un nuevo departamento, proceder con la inserción
      if (this.esNuevoDepartamento) {
        this.departamentoService.insertar(departamento).subscribe({
          next: () => {
            this.obtenerDepartamentos(); // Refrescar la lista de departamentos
            this.closeModal(); // Cerrar el modal
            Swal.fire('Éxito', 'Departamento creado exitosamente', 'success'); // Mostrar mensaje de éxito
          },
          error: (error) => {
            console.error('Error al crear el departamento', error); // Manejar errores
            Swal.fire('Error', 'No se pudo crear el departamento', 'error'); // Mostrar mensaje de error
          }
        });
      } 
      // Si es una actualización de un departamento existente
      else if (this.departamentoSeleccionado && this.departamentoSeleccionado.id) {
        // Añadir el ID al objeto departamento si se está actualizando
        const departamentoActualizado: IDepartamento = {
          ...departamento,
          id: this.departamentoSeleccionado.id
        };
  
        this.departamentoService.actualizar(departamentoActualizado).subscribe({
          next: () => {
            this.obtenerDepartamentos(); // Refrescar la lista de departamentos
            this.closeModal(); // Cerrar el modal
            Swal.fire('Éxito', 'Departamento actualizado exitosamente', 'success'); // Mostrar mensaje de éxito
          },
          error: (error) => {
            console.error('Error al actualizar el departamento', error); // Manejar errores
            Swal.fire('Error', 'No se pudo actualizar el departamento', 'error'); // Mostrar mensaje de error
          }
        });
      }
    }
  }
  

  eliminarDepartamento(id: string): void {
    Swal.fire({
      title: '¿Está seguro de eliminar este departamento? No lo podrás recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departamentoService.eliminar(id).subscribe({
          next: () => {
            this.obtenerDepartamentos();
            Swal.fire('Eliminado', 'Departamento eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el departamento', error);
            Swal.fire('Error', 'No se pudo eliminar el departamento', 'error');
          }
        });
      }
    });
  }

  // Abrir modal para agregar empleado
  openAgregarEmpleadoModal(departamentoId: string): void {
    this.departamentoIdSeleccionado = departamentoId;
    this.agregarEmpleadoModalVisible = true;
  }

  closeAgregarEmpleadoModal(): void {
    this.agregarEmpleadoModalVisible = false;
    this.filtroEmpleado = '';
    this.filtrarEmpleados(); // Resetear el filtro al cerrar el modal
  }

  agregarEmpleado(empleadoId: string): void {
    if (this.departamentoIdSeleccionado) {
      const relacion = {
        user_id: empleadoId,
        department_id: this.departamentoIdSeleccionado
      };
      this.usuarioDepartamentoService.insertar(relacion).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Empleado agregado correctamente al departamento', 'success');
          this.closeAgregarEmpleadoModal();
        },
        error: (error) => {
          console.error('Error al agregar empleado', error);
          Swal.fire('Error', 'No se pudo agregar el empleado al departamento', 'error');
        }
      });
    }
  }

  // Abrir modal para listar empleados del departamento
  listarEmpleados(departamentoId: string): void {
    this.departamentoIdSeleccionado = departamentoId;
    this.usuarioDepartamentoService.listarUsuariosPorDepartamento(this.departamentoIdSeleccionado).subscribe({
      next: (empleados) => {
        this.empleadosDepartamento = empleados;
        this.listarEmpleadosModalVisible = true;
      },
      error: (error) => {
        console.error('Error al listar empleados del departamento', error);
        Swal.fire('Error', 'No se pudo obtener la lista de empleados del departamento', 'error');
      }
    });
  }

  closeListarEmpleadosModal(): void {
    this.listarEmpleadosModalVisible = false;
    this.empleadosDepartamento = [];
  }

  eliminarEmpleado(empleadoId: string): void {
    if (this.departamentoIdSeleccionado) {
      this.usuarioDepartamentoService.eliminar(empleadoId, this.departamentoIdSeleccionado).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'Empleado eliminado del departamento correctamente', 'success');
          this.closeListarEmpleadosModal();
          // this.listarEmpleados(this.departamentoIdSeleccionado.toString()); // Actualizar lista
        },
        error: (error) => {
          console.error('Error al eliminar empleado del departamento', error);
          Swal.fire('Error', 'No se pudo eliminar el empleado del departamento', 'error');
        }
      });
    }
  }
}
