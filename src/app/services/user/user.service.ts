import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NotifyService } from '../notify/notify.service';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
        private apiService: ApiService,
        private notifyService: NotifyService,
        private sessionService: SessionService,
  ) { }

  public accountDelete(confirmedCallback: () => void): void {
    this.notifyService.notify({
      title: 'Você deseja mesmo EXCLUIR esta conta?',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
    }, (result) => {
      if (result.isConfirmed) {
        confirmedCallback();

        this.apiService.userDeleteAccount(() => {
          this.notifyService.success('Sua conta foi excluída!', () => {
            this.sessionService.logout();
            window.location.href = '/';
          });
        });
      }
    });
  }
}
