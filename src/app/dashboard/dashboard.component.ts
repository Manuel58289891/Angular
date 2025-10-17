import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../services/navigation/navigation.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
constructor(private navigationService: NavigationService) {}

  goBack() {
    this.navigationService.goBack();
  }
}
