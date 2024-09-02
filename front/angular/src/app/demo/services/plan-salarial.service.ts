import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IPlanSalarial } from '../interfaces/IPlanSalarial';

@Injectable({
  providedIn: 'root'
})
export class SalaryPlanService {
  private apiUrl = 'http://localhost/Salarix/back/controller/salaryplan.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Obtener todos los planes de salario
  getAllSalaryPlans(): Observable<IPlanSalarial[]> {
    return this.http.get<IPlanSalarial[]>(`${this.apiUrl}todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un plan de salario por ID
  getSalaryPlanByUserId(user_id: number): Observable<IPlanSalarial> {
    const formData = new FormData();
    formData.append('user_id', user_id.toString());
    return this.http.post<IPlanSalarial>(`${this.apiUrl}uno`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear un nuevo plan de salario
  createSalaryPlan(plan: IPlanSalarial): Observable<IPlanSalarial> {
    const formData = new FormData();
    formData.append('position_id', plan.position_id.toString());
    formData.append('baseSalary', plan.baseSalary.toString());
    formData.append('description', plan.description);
    formData.append('checkin', plan.checkin);
    formData.append('checkout', plan.checkout);
    formData.append('esc', plan.esc.toString());
    formData.append('esc_included', plan.esc_included.toString());
    formData.append('cp_included', plan.cp_included.toString());
    formData.append('app_included', plan.app_included.toString());
    formData.append('dts_included', plan.dts_included.toString());
    formData.append('dcs_included', plan.dcs_included.toString());
    formData.append('frp_included', plan.frp_included.toString());
    formData.append('apep_included', plan.apep_included.toString());
    formData.append('user_id', plan.user_id.toString());
    return this.http.post<IPlanSalarial>(`${this.apiUrl}insertar`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un plan de salario existente
  updateSalaryPlan(plan: IPlanSalarial): Observable<any> {
    const formData = new FormData();
    formData.append('user_id', plan.user_id.toString());
    formData.append('position_id', plan.position_id.toString());
    formData.append('baseSalary', plan.baseSalary.toString());
    formData.append('description', plan.description);
    formData.append('checkin', plan.checkin);
    formData.append('checkout', plan.checkout);
    formData.append('esc', plan.esc.toString());
    formData.append('esc_included', plan.esc_included.toString());
    formData.append('cp_included', plan.cp_included.toString());
    formData.append('app_included', plan.app_included.toString());
    formData.append('dts_included', plan.dts_included.toString());
    formData.append('dcs_included', plan.dcs_included.toString());
    formData.append('frp_included', plan.frp_included.toString());
    formData.append('apep_included', plan.apep_included.toString());
    return this.http.post<any>(`${this.apiUrl}actualizar`, formData)
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
