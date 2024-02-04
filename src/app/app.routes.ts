import {RouterModule, Routes} from '@angular/router';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {AuthGuard} from "./guard/auth.guard";
import {EmployeeDetailsComponent} from "./employee-details/employee-details.component";
import {NgModule} from "@angular/core";
import {AddEmployeeComponent} from "./employee-add/employee-add.component";
import {EmployeeEditComponent} from "./employee-edit/employee-edit.component";
import {QualificationListComponent} from "./qualification-list/qualification-list.component";

export const routes: Routes = [
  { path: '', component: EmployeeListComponent , canActivate: [AuthGuard]},
  { path: 'employee-details/:id', component: EmployeeDetailsComponent , canActivate: [AuthGuard]},
  { path: 'add-employee', component: AddEmployeeComponent , canActivate: [AuthGuard]},
  { path: 'employee-edit/:id', component: EmployeeEditComponent , canActivate: [AuthGuard]},
  { path: 'qualification-list', component: QualificationListComponent , canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
