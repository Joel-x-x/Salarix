import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/IEmpleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost/Salarix/back/controller/employees.controller.php?op=';

  constructor(private http: HttpClient) { }

  // Obtener todos los empleados
  todos(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}todos`);
  }

  // Obtener un empleado por ID
  uno(id: number): Observable<Empleado> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<Empleado>(`${this.apiUrl}uno`, formData);
  }

  // Crear un nuevo empleado
  insertar(empleado: Empleado): Observable<string> {
    const formData = new FormData();
    formData.append('firstname', empleado.firstname);
    formData.append('lastname', empleado.lastname);
    formData.append('email', empleado.email);
    formData.append('password', empleado.password);
    formData.append('identification', empleado.identification);
    formData.append('sex', empleado.sex.toString());
    formData.append('address', empleado.address);
    formData.append('birthday', empleado.birthday);
    formData.append('phone', empleado.phone);
    formData.append('status', empleado.status.toString());
    return this.http.post<string>(`${this.apiUrl}insertar`, formData);
  }

  // Actualizar un empleado (si es necesario)
  actualizar(empleado: Empleado): Observable<string> {
    const formData = new FormData();
    formData.append('id', empleado.id?.toString() || '');
    formData.append('firstname', empleado.firstname);
    formData.append('lastname', empleado.lastname);
    formData.append('email', empleado.email);
    formData.append('password', empleado.password);
    formData.append('identification', empleado.identification);
    formData.append('sex', empleado.sex.toString());
    formData.append('address', empleado.address);
    formData.append('birthday', empleado.birthday);
    formData.append('phone', empleado.phone);
    formData.append('status', empleado.status.toString());
    return this.http.post<string>(`${this.apiUrl}actualizar`, formData);
  }
}
