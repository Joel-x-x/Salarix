import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Empleado } from '../interfaces/IEmpleado';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost/Salarix/back/controller/employees.controller.php?op=';

  constructor(private http: HttpClient) { }

  // Obtener todos los empleados
  todos(): Observable<Empleado[]> {
    return this.http.get<any>(this.apiUrl + 'todos').pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(error => {
        console.error('Error al obtener los empleados:', error.message);
        return throwError(() => new Error('Error al obtener los empleados.'));
      })
    );
  }

  // Obtener un empleado por ID
  uno(id: number): Observable<Empleado> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<any>(`${this.apiUrl}uno`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(error => {
        console.error('Error al obtener el empleado:', error.message);
        return throwError(() => new Error('Error al obtener el empleado.'));
      })
    );
  }

  // Crear un nuevo empleado
  insertar(empleado: Empleado): Observable<string> {
    const formData = new FormData();
    formData.append('firstname', empleado.firstname);
    formData.append('lastname', empleado.lastname);
    formData.append('email', empleado.email);
    formData.append('password', empleado.password);
    formData.append('identification', empleado.identification);
    formData.append('sex', empleado.sex.toString());
    formData.append('address', empleado.address);
    formData.append('birthday', empleado.birthday);
    formData.append('phone', empleado.phone);
    formData.append('status', empleado.status.toString());
    return this.http.post<any>(`${this.apiUrl}insertar`, formData).pipe(
      map(response => {
        if (response.status === '201') {
          return response.message; // Suponemos que el mensaje contiene algún dato relevante
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(error => {
        console.error('Error al crear el empleado:', error.message);
        return throwError(() => new Error('Error al crear el empleado.'));
      })
    );
  }

  // Actualizar un empleado
  actualizar(empleado: Empleado): Observable<string> {
    const formData = new FormData();
    formData.append('id', empleado.id?.toString() || '');
    formData.append('firstname', empleado.firstname);
    formData.append('lastname', empleado.lastname);
    formData.append('email', empleado.email);
    formData.append('password', empleado.password);
    formData.append('identification', empleado.identification);
    formData.append('sex', empleado.sex.toString());
    formData.append('address', empleado.address);
    formData.append('birthday', empleado.birthday);
    formData.append('phone', empleado.phone);
    formData.append('status', empleado.status.toString());
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message; // Suponemos que el mensaje contiene algún dato relevante
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(error => {
        console.error('Error al actualizar el empleado:', error.message);
        return throwError(() => new Error('Error al actualizar el empleado.'));
      })
    );
  }
}
