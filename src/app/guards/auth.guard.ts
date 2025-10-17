import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.services.service/auth.services.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const user = this.authService.getCurrentUser(); // null si no está logueado
    const expectedRole = route.data['role'];        // rol requerido en la ruta

    // ❌ No hay usuario → redirigir a login
    if (!user) return this.router.parseUrl('/login');

    // Normaliza roles (quita espacios y pasa a minúsculas)
    const role = user.role.trim().toLowerCase();
    const requiredRole = expectedRole?.trim().toLowerCase();

    // ✅ Admin siempre puede entrar
    if (role === 'admin') return true;

    // Usuario normal
    if (role === 'usuario' || role === 'user') {
      // Si intenta entrar a ruta de admin → redirigir a /task
      if (requiredRole === 'admin') return this.router.parseUrl('/task');
      return true; // puede entrar a rutas de usuario
    }

    // Por defecto, redirigir al login
    return this.router.parseUrl('/login');
  }
}
