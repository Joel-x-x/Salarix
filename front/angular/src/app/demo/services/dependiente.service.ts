// src/app/services/dependent.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IDependiente } from '../interfaces/IDependiente';

@Injectable({
  providedIn: 'root'
})
export class DependentService {
  private apiUrl = 'http://localhost/Salarix/back/controller/dependents.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Crear un nuevo dependiente
  insertar(dependent: IDependiente): Observable<string> {
    const formData = this.mapDependentToFormData(dependent);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData).pipe(
      map(response => {
        if (response.status === '201') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al crear el dependiente'))
    );
  }

  // Actualizar un dependiente existente
  actualizar(dependent: IDependiente): Observable<string> {
    const formData = this.mapDependentToFormData(dependent);
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al actualizar el dependiente'))
    );
  }

  // Cambiar el estado de un dependiente
  eliminar(id: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<any>(`${this.apiUrl}cambiarEstado`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al cambiar el estado del dependiente'))
    );
  }

  // Obtener un dependiente por ID
  uno(id: string): Observable<IDependiente> {
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
      catchError(this.handleError('Error al obtener el dependiente'))
    );
  }

  // Obtener todos los dependientes
  todos(): Observable<IDependiente[]> {
    return this.http.get<any>(`${this.apiUrl}todos`).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al obtener los dependientes'))
    );
  }

  // Mapear el dependiente a FormData para enviar en peticiones POST
  private mapDependentToFormData(dependent: IDependiente): FormData {
    const formData = new FormData();
    formData.append('id', dependent.id?.toString() || '');
    formData.append('name', dependent.name);
    formData.append('lastname', dependent.lastname || '');
    formData.append('relation', dependent.relation || '');
    formData.append('disability', dependent.disability ? '1' : '0');
    formData.append('birthday', dependent.birthday || '');
    formData.append('id_user', dependent.id_user.toString());
    // Agrega otros campos según los datos de la interfaz IDependiente
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
