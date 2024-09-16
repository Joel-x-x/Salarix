import { IDetalleNomina } from './../../interfaces/IDetalleNomina';
import { Empleado } from './../../interfaces/IEmpleado';
import { DetalleNominaService } from './../../services/detalle-nomina.service';
import { NominaService } from './../../services/nomina.service';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INomina } from '../../interfaces/INomina';
import { EmpleadoService } from '../../services/empleado.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { isEmpty } from 'lodash';

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
    totalProvision: new FormControl(0),
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
    this.detallesNomina = [];

    this.detalleNominaService.todos(nomina_id).subscribe({
      next: data => {
        if (data && data.length > 0) { // Validar si llega algo
          this.detallesNomina = data;
        }
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
    if (!this.nominaSeleccionada) {
      this.grabarAutoNomina();
      return;
    }
    this.agregarRubroModalVisible = true;
    this.esNuevoDetalleNomina = !detalleNomina;
    this.detalleNominaSeleccionado = detalleNomina || null;

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
      if (result.isConfirmed) {
        this.detalleNominaService.eliminar(detalle_id).subscribe({
          next: () => {
            Swal.fire('Rubro', 'Rubro eliminado exitosamente', 'success');
            this.detallesNomina = this.detallesNomina.filter(detalle => detalle.id !== detalle_id);
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
          this.grabarAutoNomina();
        }

        this.detalleNominaService.calcularRubros(this.nominaSeleccionada?.user_id ?? '', this.nominaSeleccionada?.id ?? '').subscribe({
          next: (data) => {
            // Interfaz para los totales
            interface Totals {
              totalEgress: number;
              totalProvision: number;
              totalLiquid: number;
            }

            // Forzar el tipo de data a Totals
            let total = data as Totals;

            Swal.fire('Rubros calculados', '', 'success');
            this.listarDetallesNomina(this.nominaSeleccionada?.id ?? '');
            this.formNomina.patchValue({
              totalProvision: total.totalProvision,
              totalEgress: total.totalEgress,
              totalLiquid: total.totalLiquid,
            });
          },
          error: () => Swal.fire('Error al calcular los rubros', '', 'error'),
        })
      }
    });
  }

  // Calcular ingresos
  calcularIngresos(): void {
    Swal.fire({
      title: 'Info',
      text: 'Los ingresos se calculan en base a las horas extras y bonificaciones asegurate de haber agregado todas las bonificaciones para este empleado antes de hacerlo.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, Calcular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.nominaSeleccionada) {
          this.grabarAutoNomina();
        }
        // console.log('user: ' + this.nominaSeleccionada?.user_id + ' nomina: ' + this.nominaSeleccionada?.id);
        this.detalleNominaService.calcularSueldoIngresos(this.nominaSeleccionada?.user_id ?? '', this.nominaSeleccionada?.id ?? '').subscribe({
          next: data => {
            console.log(data);
            this.formNomina.patchValue({ totalIncome: parseFloat(data) });
            this.listarDetallesNomina(this.nominaSeleccionada?.id ?? '');
          },
          error: error => console.log('Error al eliminar la posicion', error)
        })

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
          // const detalleNomina: IDetalleNomina = JSON.parse(data); // Detalle nomina
          // this.detallesNomina = this.detallesNomina.filter(detalle => detalle.id !== detalleNomina.id);
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
    this.empleadoSeleccionado = empleado;
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
      this.nominaSeleccionada = nomina;
      // Asignar los valores del nomina al formulario
      this.formNomina.patchValue({
        ...nomina,
        start: nomina.start ?? '',
        finish: nomina.finish ?? '',
        user_id: this.getEmpleadoNombre(nomina.user_id ?? ''),
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
    this.empleadoSeleccionado = null;
    this.detallesNomina = [];
    this.formNomina.reset();
  }

  // Insertar automaticamente para poder hacer los calculos
  grabarAutoNomina(): void {
    if (this.formNomina.invalid) {
      this.formNomina.markAllAsTouched();
      Swal.fire('Error', 'Todos los campos para nómina son requeridos', 'error')
      return;
    }

    const nominaData: INomina = this.formNomina.value as INomina;

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
          this.closeModal();
          Swal.fire('Éxito', 'Nómina creada correctamente', 'success');
          this.obtenerNominas();
        },
        error: () => Swal.fire('Error', 'Error al crear la nómina', 'error')
      });
    } else {
      nominaData.user_id = this.empleadoSeleccionado?.id;
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
