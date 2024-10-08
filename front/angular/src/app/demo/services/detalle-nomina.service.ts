import { data } from './../../fack-db/series-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IDetalleNomina } from '../interfaces/IDetalleNomina'; // Asegúrate de tener esta interfaz definida

@Injectable({
  providedIn: 'root'
})
export class DetalleNominaService {
  private apiUrl = 'http://localhost/Salarix/back/controller/detail_nomina.controller.php?op='; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) { }

  // Obtener todos los detalles de nómina
  todos(nomina_id: string): Observable<IDetalleNomina[]> {
    const formData = new FormData();
    formData.append('nomina_id', nomina_id);
    return this.http.post<any>(`${this.apiUrl}todos`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al obtener los detalles de nómina'))
      );
  }

  // Obtener un detalle de nómina por ID
  uno(id: string): Observable<IDetalleNomina> {
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
        catchError(this.handleError('Error al obtener el detalle de nómina'))
      );
  }

  // Crear un nuevo detalle de nómina
  insertar(detalleNomina: IDetalleNomina): Observable<string> {
    const formData = this.mapDetalleNominaToFormData(detalleNomina);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData)
      .pipe(
        map(response => {
          if (response.status === '201') {
            return response.data; // Suponemos que el mensaje contiene algún dato relevante
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al crear el detalle de nómina'))
      );
  }

  // Actualizar un detalle de nómina existente
  actualizar(detalleNomina: IDetalleNomina): Observable<string> {
    const formData = this.mapDetalleNominaToFormData(detalleNomina);
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.message; // Suponemos que el mensaje contiene algún dato relevante
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al actualizar el detalle de nómina'))
      );
  }

  // Eliminar detalle nómina
  eliminar(id: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id);
    return this.http.post<any>(`${this.apiUrl}eliminar`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.message;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al eliminar detalle nómina'))
      );
  }

  // Calcular sueldo ingresos
  calcularSueldoIngresos(user_id: string, nomina_id: string): Observable<string> {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('nomina_id', nomina_id);
    return this.http.post<any>(`${this.apiUrl}calcular-ingresos`, formData)
    // TODO: Manejar en json de respuesta y crear el rubro de horas extras en php
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al eliminar detalle nómina'))
      );
  }

    // Calcular rubros
    calcularRubros(user_id: string, nomina_id: string): Observable<Object> {
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('nomina_id', nomina_id);
      return this.http.post<any>(`${this.apiUrl}calcular-rubros`, formData)
      // TODO: Manejar en json de respuesta y crear el rubro de horas extras en php
        .pipe(
          map(response => {
            console.log(response);
            if (response.status === '200') {
              return response.data;
            } else {
              return throwError(() => new Error(response.message));
            }
          }),
          catchError(this.handleError('Error al calcular rubros'))
        );
    }

  // Mapear el detalle de la nómina a FormData para enviar en peticiones POST
  private mapDetalleNominaToFormData(detail: IDetalleNomina): FormData {
    const formData = new FormData();
    formData.append('id', detail.id ?? '');
    formData.append('name', detail.name ?? '');
    formData.append('detail', detail.detail ?? '');
    formData.append('type', detail.type?.toString() ?? '');
    formData.append('monto', detail.monto?.toString() ?? '');
    formData.append('nomina_id', detail.nomina_id ?? '');
    formData.append('created', detail.created?.toISOString() ?? ''); // Asegúrate de convertir la fecha a un formato de cadena adecuado
    formData.append('isBonus', detail.isBonus?.toString() ?? '');
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
