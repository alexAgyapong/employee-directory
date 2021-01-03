import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/services/employee.service';
import { from, Observable, of, Subject, Subscription } from 'rxjs';
import { Employee } from '../shared/models/employee';
import { Department } from '../shared/models/department';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]>;
  departments: Department[];
  searchForm: FormGroup;
  employees: Employee[];
  destroy$ = new Subject();

  get searchTermControl(): FormControl {
    return this.searchForm
      .get('searchTerm') as FormControl;
  }

  get departmentIdControl(): FormControl {
    return this.searchForm
      .get('departmentId') as FormControl;
  }
  constructor(private employeeService: EmployeeService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getEmployees();
    this.searchForm = this.fb.group({ searchTerm: [''], departmentId: ['0'] });

    this.searchTermControl
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((input: string) => {
        // input?.length ? this.searchEmployees(input) : this.getEmployees()
        if (input?.length) {
          this.searchEmployees(input)
        } else if (this.departmentIdControl?.value > 0) {
          this.filterEmployees(this.departmentIdControl.value);
        } else { this.getEmployees() }
      }
      );

    this.departmentIdControl
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((input: number) => {
        // input > 0 ? this.filterEmployees(input) : this.getEmployees()
        if (input > 0) {
          this.filterEmployees(input);
        } else if (this.searchTermControl.value) {
          this.searchEmployees(this.searchTermControl.value);
        } else { this.getEmployees() }
      });
  }

  getEmployees(): void {
    this.employees$ = this.employeeService.getEmployees()
      .pipe(tap((employees) => {
        this.employees = employees;
        this.getEmployeeDepartments(employees);
      }));
  }

  searchEmployees(searchTerm?: string): void {
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
  }

  private getEmployeeDepartments(employees: Employee[]): void {
    const response = localStorage.getItem('departments');
    this.departments = JSON.parse(response) as Department[];
    if (!this.departments) {
      this.setEmployeeDepartment(employees, this.departments);
    } else {
      this.employeeService.getDepartments().subscribe(res => {
        this.departments = res;
        this.setEmployeeDepartment(employees, res);
        console.log({ res }, 'depts res');
      }
      );
    }
  }

  private setEmployeeDepartment(employees: Employee[], departments: Department[]): void {
    employees?.forEach(employee => {
      departments?.forEach(department => {
        if (employee.departmentId === department.id) {
          employee.department = department.name;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
