import { Routes } from '@angular/router';
import { LoginRegistrerComponent } from './login-registrer/login-registrer.component';
import{EmployeesTableComponent} from './employees-table/employees-table.component';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyTaskComponent } from './my-task/my-task.component';
export const routes: Routes = [
    {path:'workerstable',component:EmployeesTableComponent},
    {path:'mytasks',component:MyTaskComponent},
    {path:'dashboard', component:DashboardComponent},
    {path:'task',component:TaskManagerComponent},
    {path:'**', component: LoginRegistrerComponent},];
