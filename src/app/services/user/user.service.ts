import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private apiService: ApiService,
    private notifyService: NotifyService,
    private sessionService: SessionService,
  ) { }

  public accountDelete(confirmedCallback: () => void): void {
    this.notifyService.confirm('Você deseja mesmo EXCLUIR esta conta?', '', 'Excluir').then((result) => {
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
