import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.sessionService.isAuthenticated) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
