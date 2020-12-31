import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../shared/services/employee.service';
import { Observable, Subscription } from 'rxjs';
import { Employee } from '../shared/models/employee';
import { Department } from '../shared/models/department';
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employeeId: number;
  employee$: Observable<Employee>;
  subscription: Subscription;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.params.id;
    this.employee$ = this.employeeService.getEmployeeDetail(this.employeeId)
      .pipe(tap(employee => this.getEmployeeDepartment(employee)));
  }

  private getEmployeeDepartment(employee: Employee): void {
    const response = localStorage.getItem('departments');
    const departments = JSON.parse(response) as Department[];
    if (departments) {
      this.setEmployeeDepartment(employee, departments);
    } else {
      this.subscription = this.employeeService.getDepartments().subscribe(res => {
        this.setEmployeeDepartment(employee, res);
        console.log({ res }, 'depts res');
      }
      );
    }
  }

  private setEmployeeDepartment(employee: Employee, departments: Department[]): void {
    departments.forEach(department => {
      if (employee.departmentId === department.id) { employee.department = department.name; }
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
