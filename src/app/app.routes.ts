import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import{EmployeesTableComponent} from './employees-table/employees-table.component';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { AuthGuard } from './guards/auth.guard';




export const routes: Routes = [
      { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'task', 
    component: TaskManagerComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Usuario' } // Admin y usuarios normales
  },
  { 
    path: 'workerstable', 
    component: EmployeesTableComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
    {path:'my-task',component:MyTaskComponent},
    {path:'**', component: LoginRegisterComponent},];
