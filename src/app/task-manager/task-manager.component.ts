import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AddTaskComponent } from '../add-task/add-task.component';

export interface Trabajador {
  nombre: string;
  apellidos: string;
  ci: string;
  rol: 'Backend' | 'Frontend';
}

export interface Tarea {
  id?: number;
  nombre: string;
  apellidos: string;
  ci: string;
  tipo: 'Backend' | 'Frontend';
  tarea: string;
  estado: 'Pendiente' | 'Completada';
}

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskManagerComponent implements OnInit {
  apiUrl = 'http://localhost:3001';

  displayedColumns: string[] = ['nombre', 'apellidos', 'tarea', 'tipo', 'estado'];
  dataSource = new MatTableDataSource<Tarea>();
  readonly dialog = inject(MatDialog);

  ELEMENT_DATA: Trabajador[] = [
    { nombre: 'Carlos', apellidos: 'Pérez López', ci: '91022345678', rol: 'Backend' },
    { nombre: 'María', apellidos: 'Rodríguez Sánchez', ci: '95011478901', rol: 'Backend' },
    { nombre: 'José', apellidos: 'Fernández Díaz', ci: '92030512345', rol: 'Frontend' },
    { nombre: 'Ana', apellidos: 'García Morales', ci: '96042756789', rol: 'Backend' },
    { nombre: 'Luis', apellidos: 'Martínez Herrera', ci: '94081234567', rol: 'Frontend' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadTasks() {
    this.http.get<Tarea[]>(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() })
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskComponent, { data: { usuarios: this.ELEMENT_DATA } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevaTarea: Tarea = {
          nombre: result.usuario.nombre,
          apellidos: result.usuario.apellidos,
          ci: result.usuario.ci,
          tipo: result.usuario.rol,
          tarea: result.descripcion,
          estado: 'Pendiente'
        };
        this.addTask(nuevaTarea);
      }
    });
  }

  addTask(task: Tarea) {
    this.http.post<Tarea>(`${this.apiUrl}/tasks`, task, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadTasks());
  }

  updateTask(task: Tarea) {
    if (!task.id) return;
    this.http.patch<Tarea>(`${this.apiUrl}/tasks/${task.id}`, task, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadTasks());
  }

  deleteTask(task: Tarea) {
    if (!task.id) return;
    this.http.delete(`${this.apiUrl}/tasks/${task.id}`, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadTasks());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.dataSource.filterPredicate = (data: Tarea, filter: string) => {
      return (
        data.nombre.toLowerCase().includes(filter) ||
        data.apellidos.toLowerCase().includes(filter) ||
        data.tipo.toLowerCase().includes(filter) ||
        data.estado.toLowerCase().includes(filter)
      );
    };
    this.dataSource.filter = filterValue;
  }
}
