import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IFormula } from '../interfaces/IFormula';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  private apiUrl = 'http://localhost/Salarix/back/controller/formula.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Crear un nuevo registro de fórmula
  createFormula(formula: IFormula): Observable<IFormula> {
    return this.http.post<IFormula>(`${this.apiUrl}insertar`, formula)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todos los registros de fórmula
  getAllFormulas(): Observable<IFormula[]> {
    return this.http.get<IFormula[]>(`${this.apiUrl}todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener el último registro basado en la fecha
  getLastFormula(): Observable<IFormula> {
    return this.http.get<IFormula>(`${this.apiUrl}uno`)
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
