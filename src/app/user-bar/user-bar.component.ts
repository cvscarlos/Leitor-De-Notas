import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { SessionService } from '../services/session/session.service';
import { UserComponent } from '../user/user.component';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.less'],
})
export class UserBarComponent extends UserComponent implements OnInit {
  public faPencilAlt = faPencilAlt;

  constructor(
    protected override apiService: ApiService,
    public override sessionService: SessionService,
    protected override router: Router,
  ) {
    super(apiService, sessionService, router);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  public logout(): void {
    this.sessionService.logout();
    window.location.href = '/';
  }
}
