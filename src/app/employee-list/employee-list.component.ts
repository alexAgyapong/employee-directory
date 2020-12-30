import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/services/employee.service';
import { Observable } from 'rxjs';
import { Employee } from '../shared/models/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employees$ = this.employeeService.getEmployees();
  }
}
