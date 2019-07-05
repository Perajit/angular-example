import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  private nextUrl: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

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
}
