import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  email: string;
  role: string;
  ci: string;
  name?: string;
  accessToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res && res.accessToken && res.user) {
          // Guardar token y usuario correctamente
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
        }
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

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
}
