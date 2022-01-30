import { Component } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { NotifyService } from '../services/notify/notify.service';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-usage-limit',
  templateUrl: './usage-limit.component.html',
})
export class UsageLimitComponent {
  public loading = false;

  constructor(
    private api: ApiService,
    private notifyService: NotifyService,
    private sessionService: SessionService,
  ) { }

  public getOptionLink(limitType: string) {
    if (this.sessionService.isAuthenticated) {
      this.loading = true;
      this.api.getMercadoPagoLink(limitType, 1, null, (data) => {
        location.href = data.link;
      });
    } else {
      this.notifyService.info('Por favor, faça login antes de escolher o plano')
        .then(() => location.href = '/');
    }
  }
}
