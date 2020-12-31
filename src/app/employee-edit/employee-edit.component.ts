import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from '../shared/models/department';
import { EmployeeService } from '../shared/services/employee.service';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Employee } from '../shared/models/employee';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  employeeForm: FormGroup;
  departments: Department[];
  employeeId: number;
  existingEmployee: Employee;
  employee$: Observable<Employee>;
  message = '';

  get emailControl(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }

  constructor(private fb: FormBuilder,
    private employeeService: EmployeeService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.getDepartments();
    this.setupForm();
    this.getEmployeeDetail();
  }
  getEmployeeDetail(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params.id;
      if (this.employeeId) {
        this.employee$ = this.employeeService.getEmployeeDetail(this.employeeId).pipe(tap(res => {
          console.log({ res });
          this.existingEmployee = res;
          this.populateForm(res);
        }));
      } else {
        this.employeeForm.reset();
        this.setupForm();
      }
    });
  }

  private setupForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      age: [''],
      gender: ['none'],
      image: [''],
      jobTitle: ['', Validators.required],
      departmentId: [0, [Validators.min(1)]]
    });
  }

  populateForm(res: Employee): void {
    this.employeeForm.patchValue(res);
  }

  getDepartments(): void {
    const data = localStorage.getItem('departments');
    this.departments = JSON.parse(data) as Department[];
    if (!this.departments) {
      this.subscription = this.employeeService.getDepartments().subscribe(res => this.departments = res);
    }
  }

  saveEmployee(): void {
    const employee = { ...this.existingEmployee, ...this.employeeForm?.value } as Employee;
    employee.departmentId = +employee.departmentId;

    if (this.employeeForm.invalid) {
      return;
    }

    if (this.employeeForm.dirty) {
      if (this.employeeId) {
        this.employeeService.updateEmployeeDetail(employee).subscribe(res => { if (res) { this.onSaveComplete(res); } });
      } else {
        this.employeeService.addEmployee(employee).subscribe(res => { if (res) { this.onSaveComplete(res); } });
      }
    }
  }

  onSaveComplete(employee: Employee): void {
    this.message = `Employee successfully saved!`;
    setTimeout(() => {
      this.router.navigate(['/detail', employee.id], { queryParams: { isUpdated: true } });
      this.employeeForm.reset();
    }, 2000);
  }

  cancel(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
