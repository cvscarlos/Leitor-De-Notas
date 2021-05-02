import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-user-document',
    templateUrl: './user-document.component.html',
    styleUrls: ['./user-document.component.less']
})
export class UserDocumentComponent implements OnInit {

    public loading = false;
    public showUserDocumentForm = false;
    public valid = true;

    constructor(
        private apiService: ApiService,
        private notifyService: NotifyService,
        private userService: UserService,
        public sessionService: SessionService,
    ) { }

    ngOnInit(): void {
        this.apiService.userMe().then((data: any) => {
            this.showUserDocumentForm = this.sessionService.isAuthenticated && !data.userDoc;
        });
    }

    public accountDelete(): void {
        this.userService.accountDelete(() => {
            this.loading = true;
        });
    }

    public submitUserDocumentForm(form: FormGroup) {
        if (form.status !== 'VALID') {
            this.notifyService.error('CPF/CNPJ inválido');
            return;
        }

        this.loading = true;
        this.apiService.userDocumentSave(form.value.userDoc, data => {
            if (data.error) {
                this.notifyService.success(
                    data._messages.join('\n'),
                    () => { window.location.reload(); }
                );
            }
            else {
                this.notifyService.success(
                    'Dados atualizados com sucesso!',
                    () => { window.location.reload(); }
                );
            }
        }).finally(() => { this.loading = false; });
    }
}
