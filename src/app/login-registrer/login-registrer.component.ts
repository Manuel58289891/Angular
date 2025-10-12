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
import { AuthService } from '../services/auth.services.service';

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
    RouterModule
  ],
  templateUrl: './login-registrer.component.html',
  styleUrls: ['./login-registrer.component.css'],
})
export class LoginRegistrerComponent {

  hide = true;
  loginError: string = '';

  // Campos de login
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  // Campos de registro (los puedes mantener)
  nombreCompletoControlRegistro = new FormControl('', Validators.required);
  ciControl = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11)
  ]);
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

  login() {
    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    if (!email || !password) {
      this.loginError = 'Debe ingresar correo y contraseña';
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (res) => {
        // Guardar token y rol en localStorage
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('rol', res.user.rol);

        // Redirigir según rol
        if (res.user.rol === 'Admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/my-tasks']);
        }
      },
      error: () => {
        this.loginError = 'Correo o contraseña incorrectos';
      }
    });
  }
}
