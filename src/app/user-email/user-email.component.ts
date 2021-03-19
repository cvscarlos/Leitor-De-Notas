import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {ApiService} from '../shared/api/api.service';
import NotifyService from '../shared/notify/notify.service';
import SessionService from '../shared/session/session.service';

@Component({
    selector: 'app-user-email',
    templateUrl: './user-email.component.html',
    styleUrls: ['./user-email.component.less']
})
export default class UserEmailComponent implements OnInit {

    public loading = false;
    public tokenRequested = false;

    constructor(
        private apiService: ApiService,
        private notifyService: NotifyService,
        private sessionService: SessionService,
    ) { }

    ngOnInit(): void {
    }

    public submitUserEmailForm(form: FormGroup) {
        this.loading = true;

        if (this.tokenRequested) {
            this.apiService.userNewEmailToken(form.value.newEmailToken).subscribe(() => {
                this.loading = false;
                this.notifyService.success(
                    'Seu email foi alterado',
                    'A página será recarregada e você deverá se autenticar novamente',
                    () => {
                        this.sessionService.logout();
                        window.location.href = '/';
                    }
                );
            }, () => { this.loading = false; });
        }
        else {
            this.apiService.userNewEmailSave(form.value.newEmail).subscribe(() => {
                this.tokenRequested = true;
                this.loading = false;
            }, () => { this.loading = false; });
        }
    }
}
