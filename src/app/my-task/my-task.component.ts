import { Component } from '@angular/core';

interface Tarea {
  tarea: string;
  estado: 'Pendiente' | 'Completada';
}

@Component({
  selector: 'app-my-task',
  imports: [],
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.css'
})
export class MyTaskComponent {

  
}
