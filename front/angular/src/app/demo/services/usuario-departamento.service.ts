// src/app/services/usuario-departamento.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUsuarioDepartmento } from '../interfaces/IUsuarioDepartamento';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDepartamentoService {
  private apiUrl = 'http://localhost/Salarix/back/controller/user_department.controller.php?op='; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) { }

  // Insertar una nueva relación entre usuario y departamento
  insertar(relacion: IUsuarioDepartmento): Observable<string> {
    const formData = this.mapRelacionToFormData(relacion);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData).pipe(
      map(response => {
        if (response.status === '201') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al insertar la relación usuario-departamento'))
    );
  }

  // Eliminar una relación existente entre usuario y departamento
  eliminar(user_id: string, department_id: string): Observable<string> {
    // console.log(`user: ${user_id} \n department: ${department_id}`);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('department_id', department_id);
    return this.http.post<any>(`${this.apiUrl}eliminar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al eliminar la relación usuario-departamento'))
    );
  }

  // Listar usuarios por departamento
  listarUsuariosPorDepartamento(department_id: string): Observable<any> {
    const formData = new FormData();
    formData.append('department_id', department_id.toString());
    return this.http.post<any>(`${this.apiUrl}listarUsuariosPorDepartamento`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al listar usuarios por departamento'))
    );
  }

  // Mapear la relación usuario-departamento a FormData para enviar en peticiones POST
  private mapRelacionToFormData(relacion: IUsuarioDepartmento): FormData {
    const formData = new FormData();
    formData.append('user_id', relacion.user_id.toString());
    formData.append('department_id', relacion.department_id.toString());
    return formData;
  }

  // Manejar errores
  private handleError(operation = 'operación'): (error: any) => Observable<never> {
    return (error: any): Observable<never> => {
      console.error(`${operation} falló:`, error);
      return throwError(() => new Error(`${operation} falló. Por favor, inténtalo de nuevo más tarde.`));
    };
  }
}
