import { DetalleNominaService } from './../../services/detalle-nomina.service';
import { NominaService } from './../../services/nomina.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INomina } from '../../interfaces/INomina';
import { EmpleadoService } from '../../services/empleado.service';
import { IDetalleNomina } from '../../interfaces/IDetalleNomina';
import { Empleado } from '../../interfaces/IEmpleado';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [RouterLink, SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {
  nominas: INomina[] = [];
  nominaSeleccionada: INomina | null = null;
  // Detalle nomina
  detallesNomina: IDetalleNomina[] = [];
  detalleNominaSeleccionado: IDetalleNomina | null = null;
  agregarRubroModalVisible: boolean = false;
  esNuevoDetalleNomina: boolean = true;

  modalVisible: boolean = false;
  esNuevaNomina: boolean = true;
  // Empleado
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  busquedaEmpleado: string = '';
  mostrarTablaEmpleados: boolean = false;
  empleadoSeleccionado: Empleado | null = null;
  // Modal empleados
  listarEmpleadosModalVisible: boolean = false;

  // Formulario de Nómina
  formNomina = new FormGroup({
    id: new FormControl(''),
    periodName: new FormControl('', Validators.required),
    start: new FormControl('', Validators.required),
    finish: new FormControl('', Validators.required),
    detail: new FormControl(''),
    totalGross: new FormControl(0),
    totalIncome: new FormControl(0),
    totalEgress: new FormControl(0),
    totalLiquid: new FormControl(0),
    user_id: new FormControl('', Validators.required),
  });

  // Formulario de detalle nómina
  formDetalleNomina = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    detail: new FormControl('', Validators.required),
    type: new FormControl(0, Validators.required),
    monto: new FormControl(0, Validators.required),
    nomina_id: new FormControl('', Validators.required),
    isBonus: new FormControl(0, Validators.required),
  })

  constructor(private nominaService: NominaService, private empleadoService: EmpleadoService, private detalleNominaService: DetalleNominaService) { }

  ngOnInit(): void {
    this.obtenerNominas();
    this.listarEmpleados();
  }

  // Listar todas las nóminas
  obtenerNominas(): void {
    this.nominaService.todos().subscribe({
      next: (data) => this.nominas = data,
      error: (error) => console.error('Error al obtener las nóminas:', error)
    });
  }

  // Listar detalles nómina
  listarDetallesNomina(nomina_id: string): void {
    if (!nomina_id) return;

    this.detalleNominaService.todos(nomina_id).subscribe({
      next: data => {
        this.detallesNomina = data;
      },
      error: error => console.log('Error al obtener los detalles nómina:', error)
    })
  }

  // Listar empleados
  listarEmpleados(): void {
    this.empleadoService.todos().subscribe({
      next: data => {
        this.empleados = data;
        this.empleadosFiltrados = data;
      },
      error: error => console.log('Error al obtener los empleados', error)
    });
  }

  // Modal empleado
  openListarEmpleadosModal(): void {
    this.listarEmpleadosModalVisible = true;
  }

  // Modal detalles nómina
  openModalRubro(detalleNomina?: IDetalleNomina): void {
    this.esNuevoDetalleNomina = !detalleNomina;
    this.detalleNominaSeleccionado = detalleNomina || null;
    this.agregarRubroModalVisible = true;

    if (detalleNomina) {
      // Asignar los valores del detalle nomina al formulario
      this.formDetalleNomina.patchValue({
        ...detalleNomina,
      });
    } else {
      // Resetea el formulario para una nueva nómina
      this.formDetalleNomina.reset();
      this.formDetalleNomina.patchValue({ nomina_id: this.nominaSeleccionada?.id });
    }
  }

  closeListarEmpleadosModal(): void {
    this.listarEmpleadosModalVisible = false;
    this.busquedaEmpleado = '';
    this.filtrarEmpleados();
  }

  closeModalRubro(): void {
    this.agregarRubroModalVisible = false;
    this.detalleNominaSeleccionado = null;
    // this.listarDetallesNomina();
  }

  // Eliminar detalle
  eliminarRubro(detalle_id: string): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que deseas eliminar este rubro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        this.detalleNominaService.eliminar(detalle_id).subscribe({
          next: () => {
            Swal.fire('Rubro', 'Rubro eliminado exitosamente', 'success');
            this.listarDetallesNomina(this.nominaSeleccionada?.id ?? '');
          },
          error: error => console.log('Error al eliminar la posicion', error)
        });
      }
    });
  }

  // Calcular rubros
  calcularRubros(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás agregar más remuneraciones o deducciones ya que son necesarios para el calculo de los rubros.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.nominaSeleccionada) {
          this.grabar();
        }
      }
    });
  }

  // Grabra rubro
  grabarRubro(): void {
    if (this.formDetalleNomina.invalid) {
      this.formDetalleNomina.markAllAsTouched();
      Swal.fire('Error', 'Todos los campos para el rubro son requeridos', 'error')
      return;
    }

    const detalleNominaData: IDetalleNomina = this.formDetalleNomina.value as IDetalleNomina;

    if (this.esNuevoDetalleNomina) {
      this.detalleNominaService.insertar(detalleNominaData).subscribe({
        next: data => {
          this.closeModalRubro();
          // Swal.fire('Éxito', 'Rubro creado correctamente', 'success');
          this.listarDetallesNomina(this.nominaSeleccionada?.id ?? '');
        },
        error: () => Swal.fire('Error', 'Error al crear el rubro', 'error')
      });
    } else {
      this.detalleNominaService.actualizar(detalleNominaData).subscribe({
        next: () => {
          this.closeModalRubro();
          this.listarDetallesNomina(this.nominaSeleccionada?.id ?? '');
          Swal.fire('Éxito', 'Rubro actualizado correctamente', 'success');
        },
        error: () => Swal.fire('Error', 'Error al actualizar el rubro', 'error')
      });
    }
  }

  seleccionarEmpleado(empleado: Empleado): void {
    this.formNomina.patchValue({ user_id: empleado.firstname + ' ' + empleado.lastname });
    this.closeListarEmpleadosModal();
  }

  // Filtrar empleados por búsqueda
  filtrarEmpleados(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.firstname.toLowerCase().includes(this.busquedaEmpleado.toLowerCase()) ||
      empleado.lastname.toLowerCase().includes(this.busquedaEmpleado.toLowerCase())
    );
  }

  // Alternar la tabla de empleados
  toggleEmpleadoTable(): void {
    this.mostrarTablaEmpleados = !this.mostrarTablaEmpleados;
    this.listarEmpleados();
  }

  // Abre el modal para crear o editar una nómina
  openModal(nomina?: INomina): void {
    this.esNuevaNomina = !nomina;
    this.nominaSeleccionada = nomina || null;
    this.modalVisible = true;

    if (nomina) {
      // Asignar los valores del nomina al formulario
      this.formNomina.patchValue({
        ...nomina,
        start: nomina.start ?? '',
        finish: nomina.finish ?? '',
      });

      // Listar detalles
      this.listarDetallesNomina(nomina.id ?? '');
    } else {
      // Resetea el formulario para una nueva nómina
      this.formNomina.reset();
      this.detallesNomina = [];
      this.listarDetallesNomina('');
    }
  }

  // Obtener el nombre del empleado basado en su ID
  getEmpleadoNombre(userId: string): string {
    const empleado = this.empleados.find(e => e.id === userId);
    return empleado ? `${empleado.firstname} ${empleado.lastname}` : '';
  }

  // Cierra el modal
  closeModal(): void {
    this.modalVisible = false;
    this.nominaSeleccionada = null;
    this.formNomina.reset();
  }

  // Inserta o actualiza una nómina
  grabar(): void {
    if (this.formNomina.invalid) {
      this.formNomina.markAllAsTouched();
      Swal.fire('Error', 'Todos los campos para nómina son requeridos', 'error')
      return;
    }

    const nominaData: INomina = this.formNomina.value as INomina;

    if (this.esNuevaNomina) {
      this.nominaService.insertar(nominaData).subscribe({
        next: data => {
          this.nominaSeleccionada = JSON.parse(data); // Trabajar con datos de la nómina
          this.obtenerNominas();
          // this.closeModal();
          // Swal.fire('Éxito', 'Nómina creada correctamente', 'success');
          // this.obtenerNominas();
        },
        error: () => Swal.fire('Error', 'Error al crear la nómina', 'error')
      });
    } else {
      this.nominaService.actualizar(nominaData).subscribe({
        next: () => {
          this.obtenerNominas();
          this.closeModal();
          Swal.fire('Éxito', 'Nómina actualizada correctamente', 'success');
        },
        error: () => Swal.fire('Error', 'Error al actualizar la nómina', 'error')
      });
    }
  }
}
