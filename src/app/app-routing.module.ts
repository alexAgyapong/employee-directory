import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeEditGuard } from './employee-edit/employee-edit.guard';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CanDeactivateGuard } from './shared/services/can-deactivate.guard';

const routes: Routes = [
  { path: 'detail/:id', component: EmployeeDetailComponent },
  { path: 'edit/:id', component: EmployeeEditComponent, canDeactivate: [EmployeeEditGuard] },
  { path: '', component: EmployeeListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
