// src/app/services/dependent.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDependiente } from '../interfaces/IDependiente';

@Injectable({
  providedIn: 'root'
})
export class DependentService {
  private apiUrl = 'http://localhost/Salarix/back/controller/dependent.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Crear un nuevo dependiente
  createDependent(dependent: IDependiente): Observable<IDependiente> {
    return this.http.post<IDependiente>(`${this.apiUrl}insertar`, dependent)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un dependiente existente
  updateDependent(id: number, dependent: IDependiente): Observable<IDependiente> {
    return this.http.put<IDependiente>(`${this.apiUrl}actualizar&id=${id}`, dependent)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cambiar el estado de un dependiente
  changeDependentStatus(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}cambiarEstado&id=${id}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un dependiente por ID
  getDependentById(id: number): Observable<IDependiente> {
    return this.http.get<IDependiente>(`${this.apiUrl}uno&id=${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todos los dependientes
  getAllDependents(): Observable<IDependiente[]> {
    return this.http.get<IDependiente[]>(`${this.apiUrl}todos`)
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
