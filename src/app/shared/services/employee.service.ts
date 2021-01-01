import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, throwError } from 'rxjs';
import { Department } from '../models/department';
import { Employee } from '../models/employee';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly baseURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    const url = `${this.baseURL}/employeess`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  searchEmployees(searchTerm: string): Observable<Employee[]> {
    const url = `${this.baseURL}/employees?q=${searchTerm}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  filterEmployeesByDepartment(id: number): Observable<Employee[]> {
    const url = `${this.baseURL}/employees?departmentId=${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getEmployeeDetail(id: number): Observable<Employee> {
    const url = `${this.baseURL}/employees/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const url = `${this.baseURL}/employees`;
    return this.http.post<any>(url, employee).pipe(catchError(this.handleError));
  }

  updateEmployeeDetail(employee: Employee): Observable<Employee> {
    const url = `${this.baseURL}/employees/${employee.id}`;
    return this.http.put<any>(url, employee).pipe(catchError(this.handleError));
  }

  deleteEmployeeDetail(id: number): Observable<Employee> {
    const url = `${this.baseURL}/employees/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  getDepartments(): Observable<Department[]> {
    const url = `${this.baseURL}/departments`;
    return this.http.get<any>(url)
      .pipe(
        tap(data => localStorage.setItem('departments', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = '';

    if (error instanceof ErrorEvent) {
      errorMessage = `Error: ${error}`;
    } else {
      errorMessage = `Error Code: ${error?.status}\nMessage: ${error?.statusText}`;
      window.alert(errorMessage);
    }

    return throwError(error);
  }



}
