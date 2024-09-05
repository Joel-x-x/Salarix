import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IDepartamento } from '../interfaces/IDepartamento';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost/Salarix/back/controller/departments.controller.php?op='; // Ajusta esta URL si es necesario.

  constructor(private http: HttpClient) { }

  // Obtener todos los registros de departamentos
  todos(): Observable<IDepartamento[]> {
    return this.http.get<any>(`${this.apiUrl}todos`).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al obtener los departamentos'))
    );
  }

  // Obtener un departamento específico por ID
  uno(id: string): Observable<IDepartamento> {
    const formData = new FormData();
    formData.append('id', id);
    return this.http.post<any>(`${this.apiUrl}uno`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al obtener el departamento'))
    );
  }

  // Crear un nuevo departamento
  insertar(department: IDepartamento): Observable<string> {
    const formData = this.mapDepartmentToFormData(department);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData).pipe(
      map(response => {
        if (response.status === '201') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al crear el departamento'))
    );
  }

  // Actualizar un departamento existente
  actualizar(department: IDepartamento): Observable<string> {
    const formData = this.mapDepartmentToFormData(department);
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al actualizar el departamento'))
    );
  }

  // Eliminar un departamento
  eliminar(id: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id);
    return this.http.post<any>(`${this.apiUrl}eliminar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al eliminar el departamento'))
    );
  }

  // Mapear el departamento a FormData para enviar en peticiones POST
  private mapDepartmentToFormData(department: IDepartamento): FormData {
    const formData = new FormData();
    formData.append('id', department.id?.toString() || '');
    formData.append('name', department.name);
    formData.append('description', department.description || '');
    // Agrega otros campos según los datos de la interfaz IDepartamento
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
