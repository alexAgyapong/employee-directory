import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

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
}
