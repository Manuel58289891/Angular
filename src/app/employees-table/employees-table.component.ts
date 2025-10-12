import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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

export interface Trabajador {
  nombre: string;
  apellidos: string;
  ci: string;
  rol: 'Admin' | 'Desarrollador Backend' | 'Desarrollador Frontend';
  password: string; // nueva propiedad
}

const ELEMENT_DATA: Trabajador[] = [
  { nombre: 'Carlos', apellidos: 'Pérez López', ci: '91022345678', rol: 'Admin', password: 'C4rl0s#1' },
  { nombre: 'María', apellidos: 'Rodríguez Sánchez', ci: '95011478901', rol: 'Desarrollador Backend', password: 'M4r!aB7' },
  { nombre: 'José', apellidos: 'Fernández Díaz', ci: '92030512345', rol: 'Desarrollador Frontend', password: 'J0s3@F9' },
  { nombre: 'Ana', apellidos: 'García Morales', ci: '96042756789', rol: 'Desarrollador Backend', password: 'An@12345' },
  { nombre: 'Luis', apellidos: 'Martínez Herrera', ci: '94081234567', rol: 'Desarrollador Frontend', password: 'Lui$5678' }
];

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
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesTableComponent {
  displayedColumns: string[] = ['nombre', 'apellidos', 'ci', 'rol', 'password', 'acciones'];
  dataSource = new MatTableDataSource<Trabajador>(ELEMENT_DATA);

  readonly dialog = inject(MatDialog);

  openDialog(usuario: Trabajador): void {
    const dialogRef = this.dialog.open(EditUserFormComponent, { data: usuario });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(u => u === usuario);
        if (index > -1) {
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditUserFormComponent, { data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  eliminarUsuario(usuario: Trabajador) {
    this.dataSource.data = this.dataSource.data.filter(u => u !== usuario);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Trabajador, filter: string) => {
      const dataStr = (data.nombre + data.apellidos + data.rol + data.password).toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
