import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IRegistro } from '../interfaces/IRegistro';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost/Salarix/back/controller/registers.controller.php?op='; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) {}

  // Registrar entrada
  registrarEntrada(codeEmployee: string): Observable<any> {
    if (!codeEmployee) {
      Swal.fire('Error', 'El codeEmployee es requerido.', 'error');
      return throwError(() => new Error('El codeEmployee es requerido.'));
    }

    const formData = new FormData();
    formData.append('codeEmployee', codeEmployee);

    return this.http.post<any>(`${this.apiUrl}registro-entrada`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al registrar la entrada'))
    );
  }

  // Listar registros por usuario
  listarRegistrosEmpleado(codeEmployee: string, startDate: string, finishDate: string): Observable<IRegistro[]> {
    if (!codeEmployee || !startDate || !finishDate) {
      Swal.fire('Error', 'todos los campos son requeridos.', 'error');
      return throwError(() => new Error('Los campos no pueden ir vacios.'));
    }

    const formData = new FormData();
    formData.append('codeEmployee', codeEmployee);
    formData.append('finishDate', finishDate);
    formData.append('startDate', startDate);

    return this.http.post<any>(`${this.apiUrl}listar-registros-fechas-empleado`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.data;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al listar los registros'))
    );
  }

    // Listar registros por usuario
    listarRegistros(startDate: string, finishDate: string): Observable<IRegistro[]> {
      if (!startDate || !finishDate) {
        Swal.fire('Error', 'todos los campos son requeridos.', 'error');
        return throwError(() => new Error('Los campos no pueden ir vacios.'));
      }
      const formData = new FormData();
      formData.append('startDate', startDate);
      formData.append('finishDate', finishDate);
      return this.http.post<any>(`${this.apiUrl}listar-registros-fechas`, formData).pipe(
        map(response => {
          if (response.status === '200') {
            return response.data;
          } else {
            return throwError(() => new Error(response.message));
          }
        }),
        catchError(this.handleError('Error al listar los registros'))
      );
    }

  // Registrar salida
  registrarSalida(codeEmployee: string): Observable<any> {
    if (!codeEmployee) {
      Swal.fire('Error', 'El código de empleado es requerido.', 'error');
      return throwError(() => new Error('El código de empleado es requerido.'));
    }

    const formData = new FormData();
    formData.append('codeEmployee', codeEmployee);

    return this.http.post<any>(`${this.apiUrl}registro-salida`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al registrar la salida'))
    );
  }

  // Actualizar registro
  actualizarRegistro(registro: IRegistro): Observable<any> {
    if (!registro.id) {
      Swal.fire('Error', 'El id es requerido.', 'error');
      return throwError(() => new Error('El id es requerido.'));
    }

    const formData = this.mapRegistroToFormData(registro);

    return this.http.post<any>(`${this.apiUrl}actualizar`, formData).pipe(
      map(response => {
        if (response.status === '200') {
          return response.message;
        } else {
          return throwError(() => new Error(response.message));
        }
      }),
      catchError(this.handleError('Error al actualizar el registro'))
    );
  }

  // Mapear registro a FormData para enviar en peticiones POST
  private mapRegistroToFormData(registro: IRegistro): FormData {
    const formData = new FormData();
    formData.append('id', registro.id || '');
    formData.append('start', registro.start || '');
    formData.append('finish', registro.finish || '');
    if (registro.ordinary_time !== undefined) {
      formData.append('ordinary_time', registro.ordinary_time.toString());
    }
    if (registro.overtime !== undefined) {
      formData.append('overtime', registro.overtime.toString());
    }
    if (registro.night_overtime !== undefined) {
      formData.append('night_overtime', registro.night_overtime.toString());
    }
    return formData;
  }

  // Manejar errores
  private handleError(operation = 'operación'): (error: any) => Observable<never> {
    return (error: any): Observable<never> => {
      console.error(`${operation} falló:`, error);
      Swal.fire('Error', `${operation} falló. Por favor, inténtalo de nuevo más tarde.`, 'error');
      return throwError(() => new Error(`${operation} falló. Por favor, inténtalo de nuevo más tarde.`));
    };
  }
}
