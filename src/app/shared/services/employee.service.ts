import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Department } from '../models/department';
import { Employee } from '../models/employee';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly baseURL = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    const url = `${this.baseURL}/employees`;
    return this.http.get<any>(url);
  }

  getEmployeeDetail(id: number): Observable<Employee> {
    const url = `${this.baseURL}/employees/${id}`;
    return this.http.get<any>(url);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const url = `${this.baseURL}/employees`;
    return this.http.post<any>(url, employee);
  }

updateEmployeeDetail(employee: Employee): Observable<Employee> {
    const url = `${this.baseURL}/employees/${employee.id}`;
    return this.http.put<any>(url, employee);
  }

  deleteEmployeeDetail(id: number): Observable<Employee> {
    const url = `${this.baseURL}/employees/${id}`;
    return this.http.delete<any>(url);
  }

  getDepartments(): Observable<Department[]> {
    const url = `${this.baseURL}/departments`;
    return this.http.get<any>(url)
      .pipe(
        tap(data => localStorage.setItem('departments', JSON.stringify(data)))
      );
  }

}
