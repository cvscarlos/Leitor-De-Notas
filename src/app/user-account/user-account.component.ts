import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UntypedFormGroup } from '@angular/forms';
import { UserComponent } from 'src/app/user/user.component';
import { UserService } from 'src/app/services/user/user.service';
import { UserTransactions } from 'src/types';

type UserUsageHistory = {
  [cpfCnpj: string]: {
    formatedDate: string;
    value: number;
    quantity: number;
  }[];
};

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  standalone: false,
})
export class UserAccountComponent extends UserComponent implements OnInit {
  public tpl = { mpOperationNumber: false, connectTransaction: false };
  public transactionsLoading = false;
  public userUsageHistoryLoading = false;
  public mpOperationNumberLoading = false;
  public userTransactions: UserTransactions = { results: false, response: [] };
  public userUsageHistory?: UserUsageHistory;
  public accountDeleteLoading = false;

  constructor(
    private notifyService: NotifyService,
    private userService: UserService,
    protected override apiService: ApiService,
    protected override router: Router,
    public numberFormat: NumberFormatService,
    public override sessionService: SessionService,
  ) {
    super(apiService, sessionService, router);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.transactionsLoading = true;
    this.apiService.userTransactions((data) => {
      this.userTransactions = data;
      this.transactionsLoading = false;
    });

    this.userUsageHistoryLoading = true;
    this.apiService.userUsageHistory((data) => {
      this.userUsageHistory = data.result;
      this.userUsageHistoryLoading = false;
    });
  }

  public apiConnectPayment(mercadoPagoId: string | number): void {
    this.paymentAssociation(this.apiService.userMercadoPagoConnect(String(mercadoPagoId)));
  }

  public submitMpOperationNumber(form: UntypedFormGroup): void {
    this.apiConnectPayment(form.value.mpOperationNumber);
  }

  public accountDelete(): void {
    this.userService.accountDelete(() => {
      this.accountDeleteLoading = true;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paymentAssociation(httpPromise: Promise<any>) {
    this.mpOperationNumberLoading = true;

    httpPromise
      .then((data) => {
        if (data.success)
          return this.notifyService.success('A transação foi associada com o seu email');

        const msg = data.emailAssociated
          ? `Pagamento já associado ao email ${data.emailAssociated}`
          : undefined;
        return this.notifyService.error('Essa transação não pôde ser associada a sua conta', msg);
      })
      .then(() => window.location.reload())
      .catch((e) => {
        console.error(e);
        this.mpOperationNumberLoading = false;
      });
  }
}
