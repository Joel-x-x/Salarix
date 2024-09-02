import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUsuario } from '../interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost/Salarix/back/controller/users.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  obtenerTodosUsuarios(): Observable<IUsuario[]> {
    return this.http.get<any>(`${this.apiUrl}todos`)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            console.error(response.message);
            return [];
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Obtener un usuario por ID
  obtenerUsuarioPorId(id: number): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<any>(`${this.apiUrl}uno`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            console.error(response.message);
            return null;
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: IUsuario): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('firstname', usuario.firstname);
    formData.append('lastname', usuario.lastname);
    formData.append('email', usuario.email);
    formData.append('password', usuario.password || '');
    formData.append('role', usuario.role);
    formData.append('status', usuario.status.toString());
    return this.http.post<any>(`${this.apiUrl}insertar`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            console.error(response.message);
            return null;
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Actualizar un usuario
  actualizarUsuario(usuario: IUsuario): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('id', usuario.id?.toString() || '');
    formData.append('firstname', usuario.firstname);
    formData.append('lastname', usuario.lastname);
    formData.append('email', usuario.email);
    formData.append('role', usuario.role);
    formData.append('password', usuario.password || '');
    formData.append('identification', usuario.identification || '');
    formData.append('sex', usuario.sex?.toString() || '');
    formData.append('address', usuario.address || '');
    formData.append('birthday', usuario.birthday || '');
    formData.append('phone', usuario.phone || '');
    formData.append('codeEmployee', usuario.codeEmployee || '');
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            console.error(response.message);
            return null;
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Cambiar el estado de un usuario
  cambiarEstadoUsuario(id: string): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    return this.http.post<any>(`${this.apiUrl}eliminar`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.message;
          } else {
            console.error(response.message);
            return null;
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Login
  login(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    return this.http.post<any>(`${this.apiUrl}login`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            console.error(response.message);
            return null;
          }
        }),
        catchError(this.manejarError)
      );
  }

  // Manejar errores
  private manejarError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(error);
  }
}
