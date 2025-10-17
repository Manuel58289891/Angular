import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  email: string;
  role: string;
  ci: string;
  accessToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => {
        // Guardamos el token y el usuario logueado en localStorage
        localStorage.setItem('token', user.accessToken || '');
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  register(email: string, password: string, name: string, ci: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { 
      email, 
      password, 
      name, 
      role: 'Usuario',
      ci 
    });
  }

  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  // ✅ Nuevo método que necesitamos para el AuthGuard
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  // ✅ Para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
}
