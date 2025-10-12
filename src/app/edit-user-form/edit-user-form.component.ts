
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Trabajador } from '../employees-table/employees-table.component';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, ValidationErrors } from '@angular/forms';
@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
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
    @Inject(MAT_DIALOG_DATA) public usuario: Trabajador // <- Recibe los datos aquí
  ) {}

  ngOnInit(): void {
    console.log(this.usuario)
    this.agregarForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', Validators.required],
      apellidos: [this.usuario?.apellidos || '', Validators.required],
      ci: [this.usuario?.ci || '', [Validators.required, ciValidator]],
      rol: [this.usuario?.rol || '', Validators.required]
    });
  }

 guardarCambios() {
    if (this.agregarForm.valid) {
      this.dialogRef.close(this.agregarForm.value); // <-- Cierra el diálogo enviando los datos
    }
  }

  cancelar() {
    this.dialogRef.close(); // <-- Cierra el diálogo sin enviar datos

  }
    
}
export function ciValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null; // Deja que el required maneje el vacío
  }

  // Solo números
  const numberRegex = /^[0-9]*$/;
  if (!numberRegex.test(value)) {
    return { invalidCharacters: true };
  }

  // Máximo 11 dígitos
  if (value.length > 11) {
    return { maxLengthExceeded: true };
  }

  return null; // válido
}
