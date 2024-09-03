import { Component, OnInit } from '@angular/core';
import { PositionService } from '../../services/posicion.service'; // Ajusta la ruta si es necesario
import { IPosicion } from '../../interfaces/IPosicion';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-posicion',
  standalone: true,
  imports: [RouterLink, SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './posicion.component.html',
  styleUrls: ['./posicion.component.scss']
})
export class PosicionComponent implements OnInit {
  posiciones: IPosicion[] = [];
  posicionSeleccionada: IPosicion | null = null;
  modalVisible: boolean = false;
  esNuevaPosicion: boolean = true;

  // Form
  formPosicion = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl(true, Validators.required),
  });

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.listarPosiciones();
  }

  // Listar todas las posiciones
  listarPosiciones(): void {
    this.positionService.todos().subscribe({
      next: (data) => this.posiciones = data,
      error: (error) => console.error('Error al obtener las posiciones', error)
    });
  }

  // Crear o actualizar una posición
  grabar(): void {
    if (this.formPosicion.invalid) {
      this.formPosicion.markAllAsTouched();
      return;
    }

    const posicion: IPosicion = {
      name: this.formPosicion.get('name')?.value || '', // Asegura que siempre sea string
      description: this.formPosicion.get('description')?.value || '',
    };
    if (this.esNuevaPosicion) {
      console.log(posicion);
      this.positionService.insertar(posicion).subscribe({
        next: () => {
          Swal.fire('Posición', 'Posición creada con éxito.', 'success');
          this.listarPosiciones();
          this.closeModal();
        },
        error: (error) => console.error('Error al insertar la posición', error)
      });
    } else {
      posicion.id = this.posicionSeleccionada?.id || '';
      this.positionService.actualizar(posicion).subscribe({
        next: () => {
          Swal.fire('Posición', 'Posición actualizada con éxito.', 'success');
          this.listarPosiciones();
          this.closeModal();
        },
        error: (error) => console.error('Error al actualizar la posición', error)
      });
    }
  }

  // Abrir el modal para nueva posición
  openModal(): void {
    this.formPosicion.reset({ status: true }); // Resetea el formulario y por defecto el estatus es Activo
    this.posicionSeleccionada = null;
    this.esNuevaPosicion = true;
    this.modalVisible = true;
  }

  // Abrir el modal para editar posición
  openModalEditar(posicion: IPosicion): void {
    this.posicionSeleccionada = posicion;
    this.formPosicion.patchValue({
      name: posicion.name,
      description: posicion.description,
    });

    this.esNuevaPosicion = false;
    this.modalVisible = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.modalVisible = false;
  }

  // Eliminar posición
  eliminarPosicion(id: string): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea eliminar esta posición?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.positionService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Posición', 'Posición eliminada con éxito.', 'success');
            this.listarPosiciones();
          },
          error: (error) => console.error('Error al eliminar la posición', error)
        });
      }
    });
  }
}
