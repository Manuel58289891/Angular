import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.services.service/auth.services.service';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-login-register',
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
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent {
  hide = true;
  loginError: string = '';
  registerError: string = '';
  registerSuccess: string = '';

  // Controles login
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  // Controles registro
  nombreCompletoControlRegistro = new FormControl('', Validators.required);
  ciControl = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
  emailControlRegistro = new FormControl('', [Validators.required, Validators.email]);
  passwordControlRegistro = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPasswordControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
    next: (res: any) => {
      if (!res || !res.user) {
        this.loginError = 'No se recibió información del usuario';
        return;
      }

      const user = res.user;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('ci', user.ci || '');
      }

      const role = user.role.trim().toLowerCase();
      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/my-task']);
      }
    },
    error: () => {
      this.loginError = 'Correo o contraseña incorrectos';
    }
  });
}


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

    this.authService.register(email, password, nombre, ci).subscribe({
      next: (res: any) => {
        this.registerSuccess = 'Usuario registrado correctamente';
        this.registerError = '';

        if (res.accessToken && res.user && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
        }

        this.router.navigate(['/my-task']);

        // Limpiar formularios
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
