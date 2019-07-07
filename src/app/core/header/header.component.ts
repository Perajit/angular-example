import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  get currentUser$() {
    return this.authService.currentUser$;
  }

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
