import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IUsuario, IUsuarioActualizar, IUsuarioLogin } from '../interfaces/IUsuario';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role } from '../usuario/Roles/roles';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost/Salarix/back/controller/users.controller.php?op='; // Ajusta esta URL
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  // Obtener todos los usuarios
  todos(): Observable<IUsuario[]> {
    return this.http.get<any>(`${this.apiUrl}todos`).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          console.error(response.message);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error al obtener usuarios:', error.message);
        return throwError(() => new Error('Error al obtener usuarios.'));
      })
    );
  }

  // Obtener un usuario por ID
  uno(id: string): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<any>(`${this.apiUrl}uno`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          console.error(response.message);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al obtener el usuario:', error.message);
        return throwError(() => new Error('Error al obtener el usuario.'));
      })
    );
  }

  // Crear un nuevo usuario
  insertar(usuario: IUsuario): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('firstname', usuario.firstname);
    formData.append('lastname', usuario.lastname);
    formData.append('email', usuario.email);
    formData.append('password', usuario.password || '');
    formData.append('role', usuario.role || '');
    return this.http.post<any>(`${this.apiUrl}insertar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          console.error(response.message);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al crear el usuario:', error.message);
        return throwError(() => new Error('Error al crear el usuario.'));
      })
    );
  }

  // Actualizar un usuario
  actualizarUsuario(usuario: IUsuarioActualizar): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('id', usuario.id || '');
    formData.append('firstname', usuario.firstname);
    formData.append('lastname', usuario.lastname);
    formData.append('email', usuario.email);
    formData.append('role', usuario.role || '');
    formData.append('password', usuario.password || '');
    formData.append('identification', usuario.identification || '');
    formData.append('sex', usuario.sex?.toString() || '');
    formData.append('address', usuario.address || '');
    formData.append('birthday', usuario.birthday || '');
    formData.append('phone', usuario.phone || '');
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          console.error(response.message);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al actualizar el usuario:', error.message);
        return throwError(() => new Error('Error al actualizar el usuario.'));
      })
    );
  }

  // Cambiar el estado de un usuario
  eliminar(id: string): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    return this.http.post<any>(`${this.apiUrl}eliminar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          console.error(response.message);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al cambiar el estado del usuario:', error.message);
        return throwError(() => new Error('Error al cambiar el estado del usuario.'));
      })
    );
  }

  // Login
  login(usuario: IUsuarioLogin): Observable<any> {
    const formData = new FormData();
    formData.append('email', usuario.email);
    formData.append('password', usuario.password);
    return this.http.post<any>(`${this.apiUrl}login`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          const usuario: IUsuario = response.data;
          // Variables
          sessionStorage.setItem('firstname', usuario.firstname);
          sessionStorage.setItem('role', usuario.role);
          localStorage.setItem('role', usuario.role);
          // Definir variable como true
          this.loggedIn.next(true);
          // Redireccionar
          if(usuario.role == 'CONTADOR') {
            this.router.navigate(['/nomina']);
          } else {
            console.log('admin')
            this.router.navigate(['/analytics']);
          }

          return response.data;
        } else {
          this.router.navigate(['/auth/signin']);
          return response;
        }
      }),
      catchError(error => {
        console.error('Error al hacer login:', error.message);
        return throwError(() => new Error('Error al hacer login.'));
      })
    );
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Método para obtener el rol del usuario
  getUserRole(): Role {
    return (localStorage.getItem('role') as Role);
  }
}
