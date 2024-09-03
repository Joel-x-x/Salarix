import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IUsuario } from '../interfaces/IUsuario';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost/Salarix/back/controller/users.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  obtenerTodosUsuarios(): Observable<IUsuario[]> {
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
  obtenerUsuarioPorId(id: number): Observable<IUsuario> {
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
  crearUsuario(usuario: IUsuario): Observable<IUsuario> {
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
  actualizarUsuario(usuario: IUsuario): Observable<IUsuario> {
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
  cambiarEstadoUsuario(id: string): Observable<any> {
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
  login(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    return this.http.post<any>(`${this.apiUrl}login`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          console.error(response.message);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al hacer login:', error.message);
        return throwError(() => new Error('Error al hacer login.'));
      })
    );
  }
}
