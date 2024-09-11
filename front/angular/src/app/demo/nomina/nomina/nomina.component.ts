import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INomina } from '../../interfaces/INomina';
import { NominaService } from '../../services/nomina.service';
import { EmpleadoService } from '../../services/empleado.service';
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
  modalVisible: boolean = false;
  esNuevaNomina: boolean = true;
  // Empleado
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  busquedaEmpleado: string = '';
  mostrarTablaEmpleados: boolean = false;
  empleadoSeleccionado: Empleado | null = null;

  // Formulario de Nómina
  formNomina = new FormGroup({
    id: new FormControl(''),
    periodName: new FormControl('', Validators.required),
    start: new FormControl('', Validators.required),
    finish: new FormControl('', Validators.required),
    totalGross: new FormControl(0),
    totalIncome: new FormControl(0),
    totalEgress: new FormControl(0),
    totalLiquid: new FormControl(0),
    user_id: new FormControl('', Validators.required),
  });

  constructor(private nominaService: NominaService, private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.obtenerNominas();
    this.listarEmpleados();
  }

  // Listar todas las nóminas
  obtenerNominas(): void {
    this.nominaService.todos().subscribe({
      next: (data) => this.nominas = data, // Asegúrate de ajustar esto según la estructura de respuesta
      error: (error) => console.error('Error al obtener las nóminas:', error)
    });
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
    this.formNomina.patchValue({ user_id: empleado.id });
    this.mostrarTablaEmpleados = false;
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
    } else {
      // Resetea el formulario para una nueva nómina
      this.formNomina.reset();
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
      return;
    }

    const nominaData: INomina = this.formNomina.value as INomina;

    if (this.esNuevaNomina) {
      this.nominaService.insertar(nominaData).subscribe({
        next: () => {
          this.obtenerNominas();
          this.closeModal();
          Swal.fire('Éxito', 'Nómina creada correctamente', 'success');
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
