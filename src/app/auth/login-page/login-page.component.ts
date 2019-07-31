import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { LoginFormField } from './login-form.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  private nextUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.nextUrl = this.route.snapshot.queryParams.nextUrl || '';

    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      this.navigateToNextUrl();
      return;
    }
  }

  onSubmit() {
    const isFormInvalid = this.loginForm.invalid;

    if (isFormInvalid) {
      this.markAllFieldAsDirty();
      return;
    }

    const { username, password } = this.loginForm.controls;
    this.authService.login(username.value, password.value).subscribe(() => {
      this.navigateToNextUrl();
    });
  }

  shouldShowError(fieldName: LoginFormField) {
    const control = this.loginForm.controls[fieldName];

    return control.dirty && control.invalid;
  }

  private navigateToNextUrl() {
    this.router.navigate([`/${this.nextUrl}`]);
  }

  private markAllFieldAsDirty() {
    const formControls = this.loginForm.controls;
    const fieldNames = Object.keys(formControls);

    fieldNames.forEach((fieldName) => {
      formControls[fieldName].markAsDirty();
    });
  }
}
