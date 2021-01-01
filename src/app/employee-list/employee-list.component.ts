import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/services/employee.service';
import { from, Observable, of, Subscription } from 'rxjs';
import { Employee } from '../shared/models/employee';
import { Department } from '../shared/models/department';
import { debounceTime, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]>;
  departments: Department[];
  subscription: Subscription;
  searchForm: FormGroup;
  employees: Employee[];

  constructor(private employeeService: EmployeeService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getEmployees();
    this.searchForm = this.fb.group({ searchTerm: [''], departmentId: ['0'] });

    this.searchForm
      .get('searchTerm')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((input: string) => input?.length ? this.searchEmployees(input) : this.getEmployees());

    this.searchForm
      .get('departmentId')
      .valueChanges
      .subscribe((input: number) => input > 0 ? this.filterEmployees(input) : this.getEmployees());
  }

  getEmployees(): void {
    this.employees$ = this.employeeService.getEmployees()
      .pipe(tap((employees) => {
        this.employees = employees;
        this.getEmployeeDepartments(employees);
      }));
  }

  searchEmployees(searchTerm?: string): void {
    searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      this.employees$ = this.employeeService.searchEmployees(searchTerm).pipe(tap(data => {
        this.getEmployeeDepartments(data);
      }));
    }
  }

  private filterEmployees(departmentId: number): void {
    this.employees$ = this.employeeService.filterEmployeesByDepartment(departmentId).pipe(tap(data => {
      this.getEmployeeDepartments(data);
    }));

    // TODO: Filter existing employee list
    // const response = this.employees.filter(x => x.departmentId === +departmentId);
    // console.log({departmentId});
    // console.log({response});

    // this.employees$ = of(response).pipe(tap(data => {
    //   this.getEmployeeDepartments(data);
    // }));
  }

  private getEmployeeDepartments(employees: Employee[]): void {
    const response = localStorage.getItem('departments');
    this.departments = JSON.parse(response) as Department[];
    if (!this.departments) {
      this.setEmployeeDepartment(employees, this.departments);
    } else {
      this.subscription = this.employeeService.getDepartments().subscribe(res => {
        this.departments = res;
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
