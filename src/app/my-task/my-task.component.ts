import { Component, ChangeDetectionStrategy, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  selector: 'app-my-task',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    HttpClientModule
  ],
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTaskComponent implements OnInit {
  apiUrl = 'http://localhost:3001';
  dataSource = new MatTableDataSource<Tarea>();
  displayedColumns: string[] = ['tarea', 'tipo', 'estado', 'acciones'];
  readonly http = inject(HttpClient);

  usuarioCi: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

 ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.usuarioCi = currentUser?.ci || '';
    this.loadTasks();
  }
}


  getAuthHeaders() {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  loadTasks() {
    this.http.get<Tarea[]>(`${this.apiUrl}/tasks`, this.getAuthHeaders())
      .subscribe(tareas => {
        this.dataSource.data = tareas.filter(t => t.ci === this.usuarioCi);
      });
  }

  cambiarEstado(tarea: Tarea, nuevoEstado: 'Pendiente' | 'Completada') {
    if (!tarea.id) return;
    this.http.patch<Tarea>(`${this.apiUrl}/tasks/${tarea.id}`, { estado: nuevoEstado }, this.getAuthHeaders())
      .subscribe(() => this.loadTasks());
  }
}
