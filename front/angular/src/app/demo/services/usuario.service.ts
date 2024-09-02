import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IUsuario } from '../interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/Salarix/back/controller/users.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getAllUsers(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(`${this.apiUrl}todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<IUsuario>(`${this.apiUrl}uno`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear un nuevo usuario
  createUser(user: IUsuario): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('email', user.email);
    formData.append('password', user.password || '');
    formData.append('role', user.role);
    formData.append('status', user.status.toString());
    return this.http.post<IUsuario>(`${this.apiUrl}insertar`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un usuario
  updateUser(user: IUsuario): Observable<IUsuario> {
    const formData = new FormData();
    formData.append('id', user.id?.toString() || '');
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('password', user.password || '');
    formData.append('identification', user.identification || '');
    formData.append('sex', user.sex?.toString() || '');
    formData.append('address', user.address || '');
    formData.append('birthday', user.birthday || '');
    formData.append('phone', user.phone || '');
    formData.append('codeEmployee', user.codeEmployee || '');
    return this.http.post<IUsuario>(`${this.apiUrl}actualizar`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cambiar el estado de un usuario
  changeUserStatus(id: number): Observable<any> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<any>(`${this.apiUrl}cambiarEstado`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Login
  login(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    return this.http.post<any>(`${this.apiUrl}login`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejar errores
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
