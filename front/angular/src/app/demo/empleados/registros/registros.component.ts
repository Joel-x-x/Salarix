import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/registro.service'; // Ajusta la ruta si es necesario
import { IRegistro } from '../../interfaces/IRegistro';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss']
})
export class RegistroComponent implements OnInit {
  registros: IRegistro[] = [];
  modalVisible: boolean = false;

  formRegistro = new FormGroup({
    codeEmployee: new FormControl('', Validators.required),
    startDate: new FormControl(''), // Para el listado de registros
    endDate: new FormControl(''),   // Para el listado de registros
  });

  constructor(private registerService: RegisterService) {}

  ngOnInit(): void {}

  // Método para registrar la entrada
  registrarEntrada(): void {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    const codeEmployee = this.formRegistro.get('codeEmployee')?.value || '';
    this.registerService.registrarEntrada(codeEmployee).subscribe({
      next: () => {
        Swal.fire('Registro', 'Entrada registrada con éxito.', 'success');
        this.formRegistro.reset();
      },
      error: (error) => console.error('Error al registrar entrada', error)
    });
  }

  // Método para registrar la salida
  registrarSalida(): void {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    const codeEmployee = this.formRegistro.get('codeEmployee')?.value || '';
    this.registerService.registrarSalida(codeEmployee).subscribe({
      next: () => {
        Swal.fire('Registro', 'Salida registrada con éxito.', 'success');
        this.formRegistro.reset();
      },
      error: (error) => console.error('Error al registrar salida', error)
    });
  }

  // Método para listar registros entre fechas
  listarRegistros(): void {
    const startDate = this.formRegistro.get('startDate')?.value || '';
    const endDate = this.formRegistro.get('endDate')?.value || '';
    if (!startDate || !endDate) {
      Swal.fire('Error', 'Por favor, selecciona un rango de fechas.', 'error');
      return;
    }

    this.registerService.listarRegistros(startDate, endDate).subscribe({
      next: (data) => {
        this.registros = data
      },
      error: (error) => console.error('Error al listar registros', error)
    });
  }

  // Métodos para ajustar automáticamente las fechas
  setFechas(hoy: boolean = false, ultimaSemana: boolean = false, ultimoMes: boolean = false): void {
    const now = new Date();
    let startDate = new Date();
    if (hoy) {
      startDate = now;
    } else if (ultimaSemana) {
      startDate.setDate(now.getDate() - 7);
    } else if (ultimoMes) {
      startDate.setMonth(now.getMonth() - 1);
    }
    this.formRegistro.patchValue({
      startDate: formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(now, 'yyyy-MM-dd', 'en-US')
    });
  }

  // Método para abrir el modal
  openModal(): void {
    this.modalVisible = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalVisible = false;
  }
}
