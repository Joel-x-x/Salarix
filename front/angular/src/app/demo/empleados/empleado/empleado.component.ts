// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export default class EmpleadoComponent {

  constructor() {}

  // Propiedad para controlar la visibilidad del modal
  modalVisible: boolean = false;

  // Método para abrir el modal
  openModal() {
    this.modalVisible = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.modalVisible = false;
  }
}
