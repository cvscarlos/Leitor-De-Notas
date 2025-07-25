import { ApiService } from 'src/app/services/api/api.service';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-user-email',
  templateUrl: './user-email.component.html',
  styleUrls: ['./user-email.component.less'],
  standalone: false,
})
export class UserEmailComponent {
  private apiService = inject(ApiService);
  private notifyService = inject(NotifyService);
  private sessionService = inject(SessionService);

  public loading = false;

  public tokenRequested = false;

  constructor() {}

  public submitUserEmailForm(form: UntypedFormGroup) {
    this.loading = true;

    if (this.tokenRequested) {
      this.apiService.userNewEmailToken(form.value.newEmailToken).subscribe({
        next: () => {
          this.loading = false;
          this.notifyService
            .success(
              'Seu email foi alterado',
              'A página será recarregada e você deverá se autenticar novamente',
            )
            .then(() => {
              this.sessionService.logout();
              window.location.href = '/';
            });
        },
        error: () => (this.loading = false),
      });
    } else {
      this.apiService.userNewEmailSave(form.value.newEmail).subscribe({
        next: () => {
          this.tokenRequested = true;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }
  }
}
