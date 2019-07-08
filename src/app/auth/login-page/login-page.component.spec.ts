import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../core/auth/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jasmine.createSpy(),
            isLoggedIn: jasmine.createSpy()
          }
        }
      ],
      declarations: [LoginPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
