import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import SessionService from '../shared/session/session.service';

@Injectable()
export default class AuthService implements CanActivate {
    constructor(
        private sessionService: SessionService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (!this.sessionService.isAuthenticated) {
            this.router.navigate(['']);
            return false;
        }

        return true;
    }
}
