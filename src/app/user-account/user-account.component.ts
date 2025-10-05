import { Component, OnInit, inject } from '@angular/core';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';
import { UntypedFormGroup, FormsModule } from '@angular/forms';
import { UserComponent } from 'src/app/user/user.component';
import { UserService } from 'src/app/services/user/user.service';
import { UserTransactions } from 'src/types';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe, KeyValuePipe } from '@angular/common';
import { SlideToggleDirective } from '../shared-directives/slide-toggle/slide-toggle.directive';
import { CpfCnpjPipe } from '../shared-pipes/cpf-cnpj/cpf-cnpj.pipe';

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
    imports: [
        LoadingComponent,
        RouterLink,
        NgIf,
        NgFor,
        FormsModule,
        SlideToggleDirective,
        DatePipe,
        KeyValuePipe,
        CpfCnpjPipe,
    ],
})
export class UserAccountComponent extends UserComponent implements OnInit {
  private notifyService = inject(NotifyService);
  private userService = inject(UserService);
  numberFormat = inject(NumberFormatService);

  public tpl = { mpOperationNumber: false, connectTransaction: false };
  public transactionsLoading = false;
  public userUsageHistoryLoading = false;
  public mpOperationNumberLoading = false;
  public userTransactions: UserTransactions = { results: false, response: [] };
  public userUsageHistory?: UserUsageHistory;
  public accountDeleteLoading = false;

  constructor() {
    super();
  }

  override async ngOnInit() {
    super.ngOnInit();

    this.transactionsLoading = true;
    this.apiService
      .userTransactions()
      .then((data) => {
        this.userTransactions = data;
      })
      .finally(() => {
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
