import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from '../shared/models/department';
import { EmployeeService } from '../shared/services/employee.service';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  departments: Department[];
  subscription: Subscription;
  get emailControl(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private location: Location) { }


  ngOnInit(): void {
    this.getDepartments();
    this.setupForm();
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
      departmentId: ['0', [Validators.min(1)]]
    });
  }

  getDepartments(): void {
    const data = localStorage.getItem('departments');
    this.departments = JSON.parse(data) as Department[];
    if (!this.departments.length) {
      this.subscription = this.employeeService.getDepartments().subscribe(res => this.departments = res);
    }
  }
  saveEmployee() {

  }

  cancel(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
