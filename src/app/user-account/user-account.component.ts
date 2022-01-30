import { ApiService } from '../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotifyService } from '../services/notify/notify.service';
import { NumberFormatService } from '../services/number-format/number-format.service';
import { Router } from '@angular/router';
import { SessionService } from '../services/session/session.service';
import { UserComponent } from '../user/user.component';
import { UserService } from '../services/user/user.service';



type UserTransactions = {
  results: boolean,
  response: {
    desc: string,
    dateApproved: string,
    email: string,
    lockedUserDoc: string,
    reference: string,
  }[]
};
type UserUsageHistory = {
  [cpfCnpj: string]: {
    formatedDate: string,
    value: number,
    quantity: number,
  }[]
};

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.less'],
})
export class UserAccountComponent extends UserComponent implements OnInit {
  public tpl = { mpOperationNumber: false, connectTransaction: false };
  public transactionLoading = false;
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

    this.apiService.userTransactions((data) => { this.userTransactions = data; });
    this.apiService.userUsageHistory((data) => { this.userUsageHistory = data.result; });
  }

  public submitConnectTransactionForm(form: FormGroup): void {
    this.transactionLoading = true;

    this.apiService.userTransactionConnect(form.value.connectCode, data => {
      if (data.success) {
        this.notifyService.success('A transação foi associada com o seu email').then(() => window.location.reload());
      } else {
        this.notifyService.error('Essa transação não pôde ser associada a sua conta').then(() => window.location.reload());
      }
    });
  }

  public submitMpOperationNumber(form: FormGroup): void {
    this.mpOperationNumberLoading = true;

    this.apiService.userMercadoPagoConnect(form.value.mpOperationNumber, data => {
      if (data.success) {
        this.notifyService.success('A transação foi associada com o seu email').then(() => window.location.reload());
      } else {
        this.notifyService.error('Essa transação não pôde ser associada a sua conta').then(() => window.location.reload());
      }
    });
  }

  public accountDelete(): void {
    this.userService.accountDelete(() => {
      this.accountDeleteLoading = true;
    });
  }

}
