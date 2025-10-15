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

  usuarios: Trabajador[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadTasks();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // --------------------
  // Cargar usuarios desde JSON Server
  // --------------------
  loadUsuarios() {
    this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() })
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          nombre: user.name.split(' ')[0] || '',
          apellidos: user.name.split(' ').slice(1).join(' ') || '',
          ci: user.ci || '',
          rol: user.role === 'admin' ? 'Backend' : 'Frontend'
        }));
      });
  }

  // --------------------
  // Cargar tareas desde JSON Server
  // --------------------
  loadTasks() {
    this.http.get<Tarea[]>(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() })
      .subscribe(data => this.dataSource.data = data);
  }

  // --------------------
  // Abrir diálogo para agregar tarea
  // --------------------
  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskComponent, { data: { usuarios: this.usuarios } });
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

  // --------------------
  // Agregar tarea
  // --------------------
  addTask(task: Tarea) {
    this.http.post<Tarea>(`${this.apiUrl}/tasks`, task, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadTasks());
  }

  // --------------------
  // Actualizar tarea
  // --------------------
  updateTask(task: Tarea) {
    if (!task.id) return;
    this.http.patch<Tarea>(`${this.apiUrl}/tasks/${task.id}`, task, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadTasks());
  }

  // --------------------
  // Eliminar tarea
  // --------------------
  deleteTask(task: Tarea) {
    if (!task.id) return;
    this.http.delete(`${this.apiUrl}/tasks/${task.id}`, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadTasks());
  }

  // --------------------
  // Filtrar tareas
  // --------------------
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
