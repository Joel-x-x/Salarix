import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IPosicion } from '../interfaces/IPosicion';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private apiUrl = 'http://localhost/Salarix/back/controller/position.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Obtener todos los registros de posiciones
  getAllPositions(): Observable<IPosicion[]> {
    return this.http.get<IPosicion[]>(`${this.apiUrl}todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una posición específica por ID
  getPositionById(id: number): Observable<IPosicion> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<IPosicion>(`${this.apiUrl}uno`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear una nueva posición
  createPosition(position: IPosicion): Observable<IPosicion> {
    return this.http.post<IPosicion>(`${this.apiUrl}insertar`, position)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar una posición existente
  updatePosition(position: IPosicion): Observable<IPosicion> {
    return this.http.post<IPosicion>(`${this.apiUrl}actualizar`, position)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar una posición
  deletePosition(id: number): Observable<any> {
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
