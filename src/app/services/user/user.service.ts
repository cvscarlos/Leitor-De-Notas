import { ApiService } from 'src/app/services/api/api.service';
import { Injectable, inject } from '@angular/core';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private notifyService = inject(NotifyService);
  private sessionService = inject(SessionService);

  constructor() {}

  public accountDelete(confirmedCallback: () => void): void {
    this.notifyService
      .confirm('Você deseja mesmo EXCLUIR esta conta?', '', 'Excluir')
      .then((result) => {
        if (result.isConfirmed) {
          confirmedCallback();

          this.apiService.userDeleteAccount(() => {
            this.notifyService.success('Sua conta foi excluída!').then(() => {
              this.sessionService.logout();
              window.location.href = '/';
            });
          });
        }
      });
  }
}
