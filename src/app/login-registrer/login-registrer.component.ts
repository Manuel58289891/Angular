import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.services.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-registrer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './login-registrer.component.html',
  styleUrls: ['./login-registrer.component.css'],
})
export class LoginRegistrerComponent {

  hide = true;
  loginError: string = '';
  registerError: string = '';
  registerSuccess: string = '';

  // Campos de login
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  // Campos de registro
  nombreCompletoControlRegistro = new FormControl('', Validators.required);
  ciControl = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11)
  ]);
  emailControlRegistro = new FormControl('', [Validators.required, Validators.email]);
  passwordControlRegistro = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPasswordControl = new FormControl('', Validators.required);

  constructor(private authService: AuthService, private router: Router) {}

  toggleHide() {
    this.hide = !this.hide;
  }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // -------------------
  // LOGIN
  // -------------------
  login() {
    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    if (!email || !password) {
      this.loginError = 'Debe ingresar correo y contraseña';
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        // Guardamos token
        localStorage.setItem('token', res.accessToken);

        // Obtenemos datos del usuario directamente desde la respuesta
        const user = res.user; // json-server-auth devuelve user con email, role, ci
        if (user) {
          localStorage.setItem('rol', user.role);
          localStorage.setItem('ci', user.ci || '');

          const roleLower = user.role.toLowerCase();
          if (roleLower.includes('admin')) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/my-task']);
          }
        } else {
          this.loginError = 'No se recibió información del usuario';
        }
      },
      error: () => {
        this.loginError = 'Correo o contraseña incorrectos';
      }
    });
  }

  // -------------------
  // REGISTRAR USUARIO
  // -------------------
  register() {
    const nombre = this.nombreCompletoControlRegistro.value;
    const ci = this.ciControl.value;
    const email = this.emailControlRegistro.value;
    const password = this.passwordControlRegistro.value;
    const confirmPassword = this.confirmPasswordControl.value;

    if (!nombre || !ci || !email || !password || !confirmPassword) {
      this.registerError = 'Todos los campos son obligatorios';
      this.registerSuccess = '';
      return;
    }

    if (password !== confirmPassword) {
      this.registerError = 'Las contraseñas no coinciden';
      this.registerSuccess = '';
      return;
    }

    // Registramos al usuario
    this.authService.register(email, password, nombre, ci).subscribe({
      next: (res: any) => {
        console.log('Usuario registrado:', res);
        this.registerSuccess = 'Usuario registrado correctamente';
        this.registerError = '';

        // Guardamos token y rol si viene
        if (res.accessToken && res.user) {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('rol', res.user.role);
          localStorage.setItem('ci', res.user.ci || '');
        }

        // Redirigimos a my-task
        this.router.navigate(['/my-task']);

        // Limpiar campos
        this.nombreCompletoControlRegistro.reset();
        this.ciControl.reset();
        this.emailControlRegistro.reset();
        this.passwordControlRegistro.reset();
        this.confirmPasswordControl.reset();
      },
      error: (err) => {
        console.error('Error registrando usuario:', err);
        this.registerError = 'Error al registrar el usuario';
        this.registerSuccess = '';
      }
    });
  }
}
