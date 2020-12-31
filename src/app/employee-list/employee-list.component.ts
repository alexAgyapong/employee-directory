import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/services/employee.service';
import { Observable, Subscription } from 'rxjs';
import { Employee } from '../shared/models/employee';
import { Department } from '../shared/models/department';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]>;
  departments: Department[];
  subscription: Subscription;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employees$ = this.employeeService.getEmployees()
      .pipe(tap((employees) => {
        this.getEmployeeDepartments(employees);
      }));
  }

  private getEmployeeDepartments(employees: Employee[]): void {
    const response = localStorage.getItem('departments');
    const departments = JSON.parse(response) as Department[];
    if (departments) {
      this.setEmployeeDepartment(employees, departments);
    } else {
      this.subscription = this.employeeService.getDepartments().subscribe(res => {
        this.setEmployeeDepartment(employees, res);
        console.log({ res }, 'depts res');
      }
      );
    }
  }

  private setEmployeeDepartment(employees: Employee[], departments: Department[]): void {
    employees.forEach(employee => {
      departments.forEach(department => {
        if (employee.departmentId === department.id) {
          employee.department = department.name;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
