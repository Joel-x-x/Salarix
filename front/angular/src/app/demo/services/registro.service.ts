import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRegistro } from '../interfaces/IRegistro';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost/Salarix/back/controller/register.controller.php?op='; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Registrar al usuario
  primerRegistro(codigoEmpleado: string): Observable<IRegistro> {
    const params = new HttpParams().set('codigoEmpleado', codigoEmpleado);
    return this.http.get<IRegistro>(`${this.apiUrl}primerRegistro`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Listar registros por usuario
  listarRegistrosPorUsuario(userId: number): Observable<IRegistro[]> {
    const params = new HttpParams().set('user_id', userId.toString());
    return this.http.get<IRegistro[]>(`${this.apiUrl}listarRegistrosPorUsuario`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Insertar registro de salida
  insertarRegistroSalida(codigoEmpleado: string): Observable<IRegistro> {
    const params = new HttpParams().set('codigoEmpleado', codigoEmpleado);
    return this.http.get<IRegistro>(`${this.apiUrl}insertarRegistroSalida`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un registro
  actualizarRegistro(registro: IRegistro): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}actualizarRegistro`, registro)
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
