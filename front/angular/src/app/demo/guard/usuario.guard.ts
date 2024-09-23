import { UsuarioService } from './../services/usuario.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { Role } from '../usuario/Roles/roles';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const rolesEsperados = route.data['roles'] as Array<Role>; // Roles esperados en la ruta
    const rolUsuario = this.usuarioService.getUserRole();

    if (rolesEsperados.includes(rolUsuario)) {
      return true;
    } else {
      if(rolUsuario == null) {
        this.router.navigate(['/auth/signin']); // Redirigir a una página de acceso denegado
      } else {
        this.router.navigate(['/restringido']); // Redirigir a una página de acceso denegado
      }
      return false;
    }
    // return this.usuarioService.login()
  }
}
