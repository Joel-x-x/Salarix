import { Component, OnInit } from '@angular/core';
import { SalaryPlanService } from '../../services/plan-salarial.service';
import { IPlanSalarial } from '../../interfaces/IPlanSalarial';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { EmpleadoService } from '../../services/empleado.service'; // Ajusta la ruta si es necesario
import { PositionService } from '../../services/posicion.service'; // Ajusta la ruta si es necesario
import { Empleado } from '../../interfaces/IEmpleado';
import { IPosicion } from '../../interfaces/IPosicion';

@Component({
  selector: 'app-plan-salarial',
  standalone: true,
  imports: [RouterLink, SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './plan-salarial.component.html',
  styleUrls: ['./plan-salarial.component.scss']
})
export class PlanSalarialComponent implements OnInit {
  planesSalariales: IPlanSalarial[] = [];
  planSalarialSeleccionado: IPlanSalarial | null = null;
  modalVisible: boolean = false;
  esNuevoPlan: boolean = true;
  posicionSeleccionada: IPosicion | null = null; // Definición corregida
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  busquedaEmpleado: string = '';
  mostrarTablaEmpleados: boolean = false;
  empleadoSeleccionado: Empleado | null = null;
  posiciones: IPosicion[] = [];

  // Form
  formPlanSalarial = new FormGroup({
    id: new FormControl(''),
    position_id: new FormControl('', Validators.required),
    baseSalary: new FormControl('', Validators.required),
    description: new FormControl(''),
    checkin: new FormControl('', Validators.required),
    checkout: new FormControl('', Validators.required),
    esc: new FormControl(''),
    esc_included: new FormControl(false),
    cp_included: new FormControl(false),
    app_included: new FormControl(false),
    dts_included: new FormControl(false),
    dcs_included: new FormControl(false),
    frp_included: new FormControl(false),
    apep_included: new FormControl(false),
    user_id: new FormControl('', Validators.required),
  });

  constructor(
    private salaryPlanService: SalaryPlanService,
    private empleadoService: EmpleadoService,
    private posicionService: PositionService
  ) {}

  ngOnInit(): void {
    this.listarPlanesSalariales();
    this.listarEmpleados();
    this.listarPosiciones();
  }

  // Listar todos los planes salariales
  listarPlanesSalariales(): void {
    this.salaryPlanService.todos().subscribe({
      next: (data) => this.planesSalariales = data,
      error: (error) => console.error('Error al obtener los planes salariales', error)
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

  // Listar todas las posiciones
  listarPosiciones(): void {
    this.posicionService.todos().subscribe({
      next: (data) => this.posiciones = data,
      error: (error) => console.error('Error al obtener las posiciones', error)
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
    this.formPlanSalarial.patchValue({ user_id: empleado.id });
    this.mostrarTablaEmpleados = false;
  }

  // Alternar la tabla de empleados
  toggleEmpleadoTable(): void {
    this.mostrarTablaEmpleados = !this.mostrarTablaEmpleados;
    this.listarEmpleados();
  }

  // Crear o actualizar un plan salarial
  grabar(): void {
    if (this.formPlanSalarial.invalid) {
      this.formPlanSalarial.markAllAsTouched();
      return;
    }

    const planSalarial: IPlanSalarial = {
      id: this.formPlanSalarial.get('id')?.value ?? '',
      position_id: this.formPlanSalarial.get('position_id')?.value ?? '',
      baseSalary: this.formPlanSalarial.get('baseSalary')?.value ?? '',
      description: this.formPlanSalarial.get('description')?.value ?? '',
      checkin: this.formPlanSalarial.get('checkin')?.value ?? '',
      checkout: this.formPlanSalarial.get('checkout')?.value ?? '',
      esc: this.formPlanSalarial.get('esc')?.value ?? '',
      esc_included: this.formPlanSalarial.get('esc_included')?.value ? 1 : 0,
      cp_included: this.formPlanSalarial.get('cp_included')?.value ? 1 : 0,
      app_included: this.formPlanSalarial.get('app_included')?.value ? 1 : 0,
      dts_included: this.formPlanSalarial.get('dts_included')?.value ? 1 : 0,
      dcs_included: this.formPlanSalarial.get('dcs_included')?.value ? 1 : 0,
      frp_included: this.formPlanSalarial.get('frp_included')?.value ? 1 : 0,
      apep_included: this.formPlanSalarial.get('apep_included')?.value ? 1 : 0,
      user_id: this.formPlanSalarial.get('user_id')?.value ?? ''
    };

    if (this.esNuevoPlan) {
      this.salaryPlanService.insertar(planSalarial).subscribe({
        next: () => {
          this.listarPlanesSalariales();
          this.closeModal();
          Swal.fire('Guardado', 'El plan salarial ha sido guardado correctamente.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo guardar el plan salarial.', 'error')
      });
    } else {
      this.salaryPlanService.actualizar(planSalarial).subscribe({
        next: () => {
          this.listarPlanesSalariales();
          this.closeModal();
          Swal.fire('Actualizado', 'El plan salarial ha sido actualizado correctamente.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el plan salarial.', 'error')
      });
    }
  }

  // Abrir modal
  openModal(planSalarial?: IPlanSalarial): void {
    this.modalVisible = true;
    this.esNuevoPlan = !planSalarial;

    if (planSalarial) {
      // Asignar el plan salarial seleccionado
      this.planSalarialSeleccionado = planSalarial;

      // Encontrar el empleado y posición seleccionados
      const empleado = this.empleados.find(e => e.id === planSalarial.user_id);
      this.empleadoSeleccionado = empleado || null;

      const posicion = this.posiciones.find(p => p.id === planSalarial.position_id);
      this.posicionSeleccionada = posicion || null;

      // Asignar valores al formulario
      this.formPlanSalarial.patchValue({
        id: planSalarial.id,
        position_id: planSalarial.position_id,
        baseSalary: planSalarial.baseSalary,
        description: planSalarial.description,
        checkin: planSalarial.checkin,
        checkout: planSalarial.checkout,
        esc: planSalarial.esc,
        esc_included: planSalarial.esc_included ? true : false, // Manejar checkbox como booleano
        cp_included: planSalarial.cp_included ? true : false,
        app_included: planSalarial.app_included ? true : false,
        dts_included: planSalarial.dts_included ? true : false,
        dcs_included: planSalarial.dcs_included ? true : false,
        frp_included: planSalarial.frp_included ? true : false,
        apep_included: planSalarial.apep_included ? true : false,
        user_id: planSalarial.user_id,
      });
    } else {
      // Resetear el formulario para un nuevo plan salarial
      this.formPlanSalarial.reset();
      this.empleadoSeleccionado = null;
      this.posicionSeleccionada = null;
    }
  }

    // Obtener el nombre del empleado basado en su ID
    getEmpleadoNombre(userId: string): string {
      const empleado = this.empleados.find(e => e.id === userId);
      return empleado ? `${empleado.firstname} ${empleado.lastname}` : '';
    }
  
    // Obtener el nombre de la posición basado en su ID
    getPosicionNombre(positionId: string): string {
      const posicion = this.posiciones.find(p => p.id === positionId);
      return posicion ? posicion.name : '';
    }

  // Cerrar modal
  closeModal(): void {
    this.modalVisible = false;
    this.formPlanSalarial.reset();
    this.empleadoSeleccionado = null;
    this.posicionSeleccionada = null;
  }
}
