import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
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
}
