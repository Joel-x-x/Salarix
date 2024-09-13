import { data } from './../../fack-db/series-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { INomina } from '../interfaces/INomina'; // Asegúrate de tener esta interfaz definida

@Injectable({
  providedIn: 'root'
})
export class NominaService {
  private apiUrl = 'http://localhost/Salarix/back/controller/nominas.controller.php?op='; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) { }

  // Obtener todas las nóminas
  todos(): Observable<INomina[]> {
    return this.http.get<any>(`${this.apiUrl}todos`)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al obtener las nóminas'))
      );
  }

  // Obtener una nómina por ID
  uno(id: string): Observable<INomina> {
    const formData = new FormData();
    formData.append('id', id);
    return this.http.post<any>(`${this.apiUrl}uno`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al obtener la nómina'))
      );
  }

  // Crear una nueva nómina
  insertar(nomina: INomina): Observable<string> {
    const formData = this.mapNominaToFormData(nomina);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData)
      .pipe(
        map(response => {
          if (response.status === '201') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al crear la nómina'))
      );
  }

  // Actualizar una nómina existente
  actualizar(nomina: INomina): Observable<string> {
    const formData = this.mapNominaToFormData(nomina);
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.message; // Suponemos que el mensaje contiene algún dato relevante
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al actualizar la nómina'))
      );
  }

// Mapear la nómina a FormData para enviar en peticiones POST
private mapNominaToFormData(nomina: INomina): FormData {
  const formData = new FormData();
  formData.append('id', nomina.id ?? '');
  formData.append('periodName', nomina.periodName ?? '');
  formData.append('start', nomina.start);
  formData.append('finish', nomina.finish);
  formData.append('detail', nomina.detail);
  formData.append('totalGross', nomina.totalGross?.toString() ?? '');
  formData.append('totalIncome', nomina.totalIncome?.toString() ?? '');
  formData.append('totalEgress', nomina.totalEgress?.toString() ?? '');
  formData.append('totalLiquid', nomina.totalLiquid?.toString() ?? '');
  formData.append('user_id', nomina.user_id ?? '');
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
