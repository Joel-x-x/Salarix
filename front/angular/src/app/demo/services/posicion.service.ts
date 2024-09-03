import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IPosicion } from '../interfaces/IPosicion';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private apiUrl = 'http://localhost/Salarix/back/controller/positions.controller.php?op='; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) { }

  // Obtener todos los registros de posiciones
  todos(): Observable<IPosicion[]> {
    return this.http.get<any>(`${this.apiUrl}todos`).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al obtener las posiciones'))
    );
  }

  // Obtener una posición específica por ID
  uno(id: string): Observable<IPosicion> {
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
      catchError(this.handleError('Error al obtener la posición'))
    );
  }

  // Crear una nueva posición
  insertar(position: IPosicion): Observable<string> {
    const formData = this.mapPositionToFormData(position);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData).pipe(
      map(response => {
        if (response.status === '201') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al crear la posición'))
    );
  }

  // Actualizar una posición existente
  actualizar(position: IPosicion): Observable<string> {
    const formData = this.mapPositionToFormData(position);
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al actualizar la posición'))
    );
  }

  // Eliminar una posición
  eliminar(id: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<any>(`${this.apiUrl}eliminar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al eliminar la posición'))
    );
  }

  // Mapear la posición a FormData para enviar en peticiones POST
  private mapPositionToFormData(position: IPosicion): FormData {
    const formData = new FormData();
    formData.append('id', position.id?.toString() || '');
    formData.append('name', position.name);
    formData.append('description', position.description || '');
    // Agrega otros campos según los datos de la interfaz IPosicion
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
