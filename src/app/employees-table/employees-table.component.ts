import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditUserFormComponent } from '../edit-user-form/edit-user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Trabajador {
  id: number;
  nombre_apellidos: string;
  email: string;
  rol: string;
  ci: string;
}

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre_apellidos', 'ci', 'email', 'rol', 'acciones'];
  dataSource = new MatTableDataSource<Trabajador>();
  readonly dialog = inject(MatDialog);
  readonly http = inject(HttpClient);
  apiUrl = 'http://localhost:3001/users'; // json-server URL

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.dataSource.data = data.map(user => ({
        id: user.id,
        nombre_apellidos: user.name || '',
        email: user.email || '',
        rol: user.role || '',
        ci: user.ci || ''   
      }));
    });
  }

  openDialog(usuario: Trabajador): void {
    const dialogRef = this.dialog.open(EditUserFormComponent, { data: usuario });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Guardar cambios en JSON server
        this.http.patch(`${this.apiUrl}/${usuario.id}`, {
          name: result.nombre_apellidos,
          email: result.email,
          role: result.rol,
          ci: result.ci
        }).subscribe(() => {
          const index = this.dataSource.data.findIndex(u => u.id === usuario.id);
          if (index > -1) {
            this.dataSource.data[index] = { ...this.dataSource.data[index], ...result };
            this.dataSource._updateChangeSubscription();
          }
        });
      }
    });
  }

  eliminarUsuario(usuario: Trabajador) {
    this.http.delete(`${this.apiUrl}/${usuario.id}`).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(u => u.id !== usuario.id);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.dataSource.filterPredicate = (data: Trabajador, filter: string) => {
      return (
        data.nombre_apellidos.toLowerCase().includes(filter) ||
        data.ci.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter) ||
        data.rol.toLowerCase().includes(filter)
      );
    };
    this.dataSource.filter = filterValue;
  }
}
