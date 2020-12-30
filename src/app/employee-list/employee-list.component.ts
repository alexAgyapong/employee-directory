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
        this.setEmployeeDepartment(employees);
      }));
  }

  getEmployeeDepartments(): void {
    this.subscription = this.employeeService.getDepartments().subscribe((res) => {
      this.departments = res;
    });
  }

  private setEmployeeDepartment(employees: Employee[]): void {
    this.employeeService.getDepartments().subscribe(departments => {
      this.departments = departments;
      employees.forEach(employee => {
        departments.forEach(department => {
          if (employee.departmentId === department.id) {
            employee.department = department.name;
          }
        });
      });
      console.log({ res: departments }, 'depts res');
    }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
