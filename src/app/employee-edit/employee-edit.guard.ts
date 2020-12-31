import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeEditComponent } from './employee-edit.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEditGuard implements CanDeactivate<EmployeeEditComponent> {
  canDeactivate(component: EmployeeEditComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (component.employeeForm.dirty) {
      return confirm('Are you sure you want to leave this page?');
    }
    return true;
  }

}
