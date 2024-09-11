import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IPlanSalarial } from '../interfaces/IPlanSalarial';

@Injectable({
  providedIn: 'root'
})
export class SalaryPlanService {
  private apiUrl = 'http://localhost/Salarix/back/controller/salary_plans.controller.php?op='; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) { }

  // Obtener todos los planes de salario
  todos(): Observable<IPlanSalarial[]> {
    return this.http.get<any>(`${this.apiUrl}todos`)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al obtener los planes de salario'))
      );
  }

  // Obtener un plan de salario por ID de usuario
  uno(user_id: string): Observable<IPlanSalarial> {
    const formData = new FormData();
    formData.append('user_id', user_id);
    return this.http.post<any>(`${this.apiUrl}uno`, formData)
      .pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al obtener el plan de salario'))
      );
  }

  // Crear un nuevo plan de salario
  insertar(plan: IPlanSalarial): Observable<string> {
    const formData = this.mapPlanToFormData(plan);
    return this.http.post<any>(`${this.apiUrl}insertar`, formData)
      .pipe(
        map(response => {
          if (response.status === '201') {
            return response.message; // Suponemos que el mensaje contiene algún dato relevante
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al crear el plan de salario'))
      );
  }

  // Actualizar un plan de salario existente
actualizar(plan: IPlanSalarial): Observable<string> {
  const formData = this.mapPlanToFormData(plan);
  return this.http.post<any>(`${this.apiUrl}actualizar`, formData)
    .pipe(
      map(response => {
        console.log('Respuesta del servidor:', response); // Agrega esto para depuración
        if (response.status === '200') {
          return response.message; // Suponemos que el mensaje contiene algún dato relevante
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al actualizar el plan de salario'))
    );
}


  // Mapear el plan a FormData para enviar en peticiones POST
  private mapPlanToFormData(plan: IPlanSalarial): FormData {
    const formData = new FormData();
    formData.append('id', plan.id ?? '');
    formData.append('user_id', plan.user_id.toString());
    formData.append('position_id', plan.position_id.toString());
    formData.append('baseSalary', plan.baseSalary?.toString() ?? '');
    formData.append('description', plan.description ?? '');
    formData.append('checkin', plan.checkin ?? '');
    formData.append('checkout', plan.checkout ?? '');
    formData.append('esc_included', plan.esc_included.toString());
    formData.append('cp_included', plan.cp_included.toString());
    formData.append('app_included', plan.app_included.toString());
    formData.append('dts_included', plan.dts_included.toString());
    formData.append('dcs_included', plan.dcs_included.toString());
    formData.append('frp_included', plan.frp_included.toString());
    formData.append('apep_included', plan.apep_included.toString());
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
