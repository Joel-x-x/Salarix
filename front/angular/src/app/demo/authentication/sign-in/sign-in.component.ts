import { UsuarioService } from './../../services/usuario.service';
// angular import
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IUsuarioLogin } from '../../interfaces/IUsuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {
// Form
formLogin = new FormGroup({
  email: new FormControl(''),
  password: new FormControl('')
});

  constructor(private usuarioService: UsuarioService){}

  // Login
  login(): void {
    let usuario: IUsuarioLogin = {
      email: this.formLogin.controls['email'].value ?? '',
      password: this.formLogin.controls['password'].value ?? ''
    }

    if(usuario.email == '' || usuario.password == '') {
      Swal.fire('Todos los campos son requeridos', '', 'warning')
    }
    // Usar servicio
    this.usuarioService.login(usuario).subscribe({
      next: data => {
        if(data.status === '404') {
          Swal.fire(data.message, '', 'warning')
        }
      },
      error: data => console.log("Error"),
    })
  }
}
