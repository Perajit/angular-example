import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  get currentUser$() {
    return this.authService.currentUser$;
  }

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
  }
}
