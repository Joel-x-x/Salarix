import { data } from '../../fack-db/series-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IReporteNomina, IReporteRegistro } from '../interfaces/IReporte'; // Asegúrate de tener esta interfaz definida

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost/Salarix/back/controller/reportes.controller.php?op='; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) { }

  // Obtener todas las nóminas
  reporteNominas(start: string, finish: string): Observable<IReporteNomina[]> {
    const formData = new FormData();
    formData.append('start', start);
    formData.append('finish', finish);
    console.log(start, finish);

    return this.http.post<any>(`${this.apiUrl}nominas`, formData)
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

  reporteRegistros(start: string, finish: string): Observable<IReporteRegistro[]> {
    const formData = new FormData();
    formData.append('start', start);
    formData.append('finish', finish);
    console.log(start, finish);

    return this.http.post<any>(`${this.apiUrl}registros`, formData)
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

// Mapear la nómina a FormData para enviar en peticiones POST
private mapNominaToFormData(nomina: IReporteNomina): FormData {
  const formData = new FormData();
  formData.append('id', nomina.id ?? '');
  formData.append('periodName', nomina.periodName ?? '');
  formData.append('start', nomina.start);
  formData.append('finish', nomina.finish);
  formData.append('detail', nomina.detail);
  formData.append('totalProvision', nomina.totalProvision?.toString() ?? '');
  formData.append('totalIncome', nomina.totalIncome?.toString() ?? '');
  formData.append('totalEgress', nomina.totalEgress?.toString() ?? '');
  formData.append('totalLiquid', nomina.totalLiquid?.toString() ?? '');
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
