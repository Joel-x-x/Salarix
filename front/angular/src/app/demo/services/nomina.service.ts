import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { INomina } from '../interfaces/INomina';

@Injectable({
  providedIn: 'root'
})
export class NominaService {
  private apiUrl = 'http://localhost/Salarix/back/controller/nomina.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Obtener todas las nóminas
  getAllNominas(): Observable<INomina[]> {
    return this.http.get<INomina[]>(`${this.apiUrl}todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una nómina específica por ID
  getNominaById(id: number): Observable<INomina> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<INomina>(`${this.apiUrl}uno`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear una nueva nómina
  createNomina(nomina: INomina): Observable<INomina> {
    return this.http.post<INomina>(`${this.apiUrl}insertar`, nomina)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar una nómina existente
  updateNomina(nomina: INomina): Observable<INomina> {
    return this.http.post<INomina>(`${this.apiUrl}actualizar`, nomina)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar una nómina
  deleteNomina(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any>(`${this.apiUrl}eliminar`, { params })
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
