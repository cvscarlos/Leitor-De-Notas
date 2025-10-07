import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UserData } from 'src/types';

@Component({
  selector: 'app-user',
  template: '<b>User Component</b>',
})
export class UserComponent implements OnInit {
  protected apiService = inject(ApiService);
  public sessionService = inject(SessionService);
  protected router = inject(Router);

  public loading = false;
  public user: UserData = {
    allowManageMembers: false,
    email: '',
    limit: '',
    termsAccepted: false,
    userDoc: '',
    expiresIn: '',
    isFreePlan: true,
  };

  constructor() {}

  ngOnInit(): void {
    this.loading = true;

    this.apiService.userMe().then((data) => {
      if (data) this.user = data;
      this.loading = false;

      if (this.sessionService.isAuthenticated && !data?.termsAccepted) {
        this.router.navigate(['privacidade-termos']);
      }
    });
  }
}
