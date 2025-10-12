import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LoginRegistrerComponent } from './app/login-registrer/login-registrer.component';
import { provideAnimations } from '@angular/platform-browser/animations';
bootstrapApplication(LoginRegistrerComponent, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations() // <--- esto reemplaza BrowserAnimationsModule
  ]
});