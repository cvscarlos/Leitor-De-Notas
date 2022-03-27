import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UserData } from 'src/types';

@Component({
  selector: 'app-user',
  template: '<b>User Component</b>',
})
export class UserComponent implements OnInit {

  public user?: UserData;
  public loading = false;

  constructor(
    protected apiService: ApiService,
    public sessionService: SessionService,
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.apiService.userMe().then((data) => {
      this.user = data;
      this.loading = false;

      if (this.sessionService.isAuthenticated && !data?.termsAccepted) {
        this.router.navigate(['privacidade-termos']);
      }
    });
  }
}
