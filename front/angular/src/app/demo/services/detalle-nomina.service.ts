// src/app/services/detail-nomina.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDetalleNomina } from '../interfaces/IDetalleNomina';

@Injectable({
  providedIn: 'root'
})
export class DetailNominaService {
  private apiUrl = 'http://localhost/Salarix/back/controller/detailNomina.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Crear un nuevo detalle de nómina
  createDetailNomina(detail: IDetalleNomina): Observable<IDetalleNomina> {
    return this.http.post<IDetalleNomina>(`${this.apiUrl}insertar`, detail)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un detalle de nómina existente
  updateDetailNomina(id: number, detail: IDetalleNomina): Observable<IDetalleNomina> {
    return this.http.put<IDetalleNomina>(`${this.apiUrl}actualizar&id=${id}`, detail)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un detalle de nómina por ID
  getDetailNominaById(id: number): Observable<IDetalleNomina> {
    return this.http.get<IDetalleNomina>(`${this.apiUrl}uno&id=${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todos los detalles de nómina para una nómina específica
  getAllDetailNomina(nominaId: number): Observable<IDetalleNomina[]> {
    return this.http.get<IDetalleNomina[]>(`${this.apiUrl}todos&nomina_id=${nominaId}`)
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
