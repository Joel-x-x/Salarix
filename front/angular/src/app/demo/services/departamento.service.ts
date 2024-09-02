import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDepartamento } from '../interfaces/IDepartamento';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost/Salarix/back/controller/department.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Crear un nuevo departamento
  createDepartment(department: IDepartamento): Observable<IDepartamento> {
    return this.http.post<IDepartamento>(`${this.apiUrl}insertar`, department)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un departamento existente
  updateDepartment(id: number, department: IDepartamento): Observable<IDepartamento> {
    return this.http.put<IDepartamento>(`${this.apiUrl}actualizar/${id}`, department)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un departamento por ID
  getDepartmentById(id: number): Observable<IDepartamento> {
    return this.http.get<IDepartamento>(`${this.apiUrl}uno/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todos los departamentos
  getAllDepartments(): Observable<IDepartamento[]> {
    return this.http.get<IDepartamento[]>(`${this.apiUrl}todos`)
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
