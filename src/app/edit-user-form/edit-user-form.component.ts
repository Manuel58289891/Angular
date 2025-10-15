import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Trabajador } from '../employees-table/employees-table.component';

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css']
})
export class EditUserFormComponent implements OnInit {

  agregarForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Trabajador
  ) {}

  ngOnInit(): void {
    this.agregarForm = this.fb.group({
      nombre_apellidos: [this.usuario?.nombre_apellidos || '', Validators.required],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
      ci: [this.usuario?.ci || '', [Validators.required, ciValidator]],
      rol: [this.usuario?.rol || '', Validators.required]
    });
  }

  guardarCambios() {
    if (this.agregarForm.valid) {
      this.dialogRef.close(this.agregarForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

// Validador CI
export function ciValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const numberRegex = /^[0-9]*$/;
  if (!numberRegex.test(value)) return { invalidCharacters: true };
  if (value.length > 11) return { maxLengthExceeded: true };
  
  return null;
}
