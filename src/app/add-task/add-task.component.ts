import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Trabajador } from '../task-manager/task-manager.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  usuarios: Trabajador[];
  tareaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuarios: Trabajador[] }
  ) {
    this.usuarios = data.usuarios;
    this.tareaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(256)]],
      usuario: [null, Validators.required]
    });
  }

  asignarTarea() {
    if (this.tareaForm.valid) {
      this.dialogRef.close({
        descripcion: this.tareaForm.value.descripcion,
        usuario: this.tareaForm.value.usuario
      });
    }
  }
}
