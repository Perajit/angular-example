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

  get formControls() {
    return this.loginForm.controls;
  }

  get isFormInvalid() {
    return this.loginForm.invalid;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.nextUrl = this.route.snapshot.queryParams.nextUrl || '';

    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      this.navigateToReturnUrl();
      return;
    }
  }

  onSubmit() {
    if (this.isFormInvalid) {
      this.markAllFieldAsDirty();
      return;
    }

    const { username, password } = this.formControls;
    this.authService.login(username.value, password.value).subscribe(() => {
      this.navigateToReturnUrl();
    });
  }

  navigateToReturnUrl() {
    this.router.navigate([`/${this.nextUrl}`]);
  }

  hasError(fieldName: LoginFormField) {
    const control = this.formControls[fieldName];

    if (!control) {
      return;
    }

    return control.dirty && control.invalid;
  }

  getErrorMessage(fieldName: LoginFormField) {
    const control = this.formControls[fieldName];
    const errors = control ? control.errors : null;

    if (!errors) {
      return;
    }

    if (errors.required) {
      return `This field is required`;
    }
  }

  private markAllFieldAsDirty() {
    const formControls = this.formControls;
    const fieldNames = Object.keys(formControls);

    fieldNames.forEach((fieldName) => {
      formControls[fieldName].markAsDirty();
    });
  }
}
