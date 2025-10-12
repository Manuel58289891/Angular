import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegistrerComponent } from './login-registrer.component';

describe('LoginRegistrerComponent', () => {
  let component: LoginRegistrerComponent;
  let fixture: ComponentFixture<LoginRegistrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegistrerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegistrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
