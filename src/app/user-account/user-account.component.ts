import { ApiService } from '../shared/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericObject } from '../shared/generic-object.interface';
import { NotifyService } from '../shared/notify/notify.service';
import { NumberFormatService } from '../shared/number-format/number-format.service';
import { Router } from '@angular/router';
import { SessionService } from '../shared/session/session.service';
import { UserComponent } from '../user/user.component';
import { UserService } from '../shared/user/user.service';


@Component({
    selector: 'app-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.less']
})
export class UserAccountComponent extends UserComponent implements OnInit {
    public tpl: GenericObject = {};
    public transactionLoading = false;
    public mpOperationNumberLoading = false;
    public userTransactions: GenericObject = {};
    public userUsageHistory: GenericObject = {};
    public accountDeleteLoading = false;

    constructor(
        private notifyService: NotifyService,
        private userService: UserService,
        protected apiService: ApiService,
        protected router: Router,
        public numberFormat: NumberFormatService,
        public sessionService: SessionService,
    ) {
        super(apiService, sessionService, router);
    }

    ngOnInit() {
        super.ngOnInit();

        this.apiService.userTransactions((data) => { this.userTransactions = data; });
        this.apiService.userUsageHistory((data) => { this.userUsageHistory = data; });
    }

    public submitConnectTransactionForm(form: FormGroup): void {
        this.transactionLoading = true;

        this.apiService.userTransactionConnect(form.value.connectCode, data => {
            if (data.success) {
                this.notifyService.success('A transação foi associada com o seu email', '', () => { window.location.reload(); });
            }
            else {
                this.notifyService.error('Essa transação não pôde ser associada a sua conta', '', () => { window.location.reload(); });
            }
        });
    }

    public submitMpOperationNumber(form: FormGroup): void {
        this.mpOperationNumberLoading = true;
        console.log(form.value);

        this.apiService.userMercadoPagoConnect(form.value.mpOperationNumber, data => {
            if (data.success) {
                this.notifyService.success('A transação foi associada com o seu email', '', () => { window.location.reload(); });
            }
            else {
                this.notifyService.error('Essa transação não pôde ser associada a sua conta', '', () => { window.location.reload(); });
            }
        });
    }

    public accountDelete(): void {
        this.userService.accountDelete(() => {
            this.accountDeleteLoading = true;
        });
    }

}
