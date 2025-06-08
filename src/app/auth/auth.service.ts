import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session/session.service';

@Injectable()
export class AuthService {
  private sessionService = inject(SessionService);
  private router = inject(Router);

  constructor() {}

  canActivate(): boolean {
    if (!this.sessionService.isAuthenticated) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
