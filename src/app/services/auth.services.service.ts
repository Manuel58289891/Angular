import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  email: string;
  rol: 'Admin' | 'Usuario';
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
  register(email: string, password: string, name: string, role: string = 'user'): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, { 
      email, 
      password, 
      name, 
      role   
    });
  }

}


