import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../shared/services/employee.service';
import { Observable } from 'rxjs';
import { Employee } from '../shared/models/employee';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employeeId: number;
  employee$: Observable<Employee>;

  constructor(private employeeService: EmployeeService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.employeeId = +this.router.snapshot.params.id;
    this.employee$ = this.employeeService.getEmployeeDetail(this.employeeId);
  }

goBack(){
  
}
}
