import { ApiService } from 'src/app/services/api/api.service';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-user-email',
  templateUrl: './user-email.component.html',
  styleUrls: ['./user-email.component.less'],
})
export class UserEmailComponent {

  public loading = false;

  public tokenRequested = false;

  constructor(
    private apiService: ApiService,
    private notifyService: NotifyService,
    private sessionService: SessionService,
  ) { }

  public submitUserEmailForm(form: FormGroup) {
    this.loading = true;

    if (this.tokenRequested) {
      this.apiService.userNewEmailToken(form.value.newEmailToken).subscribe({
        next: () => {
          this.loading = false;
          this.notifyService.success(
            'Seu email foi alterado',
            'A página será recarregada e você deverá se autenticar novamente',
          ).then(() => {
            this.sessionService.logout();
            window.location.href = '/';
          });
        },
        error: () => this.loading = false,
      });
    } else {
      this.apiService.userNewEmailSave(form.value.newEmail).subscribe({
        next: () => {
          this.tokenRequested = true;
          this.loading = false;
        },
        error: () => this.loading = false,
      });
    }
  }
}
