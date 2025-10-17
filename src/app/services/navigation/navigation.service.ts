import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private history: string[] = [];

  constructor(private router: Router) {
    // Escucha los cambios de ruta para guardar historial
    this.router.events.subscribe(event => {
    
    });
  }

  goBack() {
    // Simplemente retrocede en la historia del navegador
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Si no hay historial, define una ruta segura de fallback
      this.router.navigate(['**']);
    }
  }
}
