import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UserComponent } from 'src/app/user/user.component';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { NotifyService } from '../services/notify/notify.service';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
})
export class UserBarComponent extends UserComponent implements OnInit {
  public faPencilAlt = faPencilAlt;

  constructor(
    public override sessionService: SessionService,
    protected override apiService: ApiService,
    protected override router: Router,
    private notifyService: NotifyService,
  ) {
    super(apiService, sessionService, router);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.sessionService.isAuthenticated) this.modalAvailablePayments();
  }

  private modalAvailablePayments() {
    const sawAvailablePayment = localStorage.getItem('bgggSawAvailablePayment');
    if (sawAvailablePayment) return;

    this.apiService.userTransactions(async ({ response }) => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const userMe = await this.apiService.userMe();
      if (!userMe?.isFreePlan) return;

      const availablePayment = response.find(
        (transaction) => new Date(transaction.dateApproved) > oneYearAgo && !transaction.inUse,
      );
      if (!availablePayment) return;

      const { isConfirmed } = await this.notifyService.confirm(
        'Existe um pagamento disponível',
        'Deseja associar a sua conta?',
      );
      localStorage.setItem('bgggSawAvailablePayment', '1');

      if (isConfirmed) this.router.navigate(['minha-conta']);
    });
  }

  public logout(): void {
    this.sessionService.logout();
    window.location.href = '/';
  }
}
