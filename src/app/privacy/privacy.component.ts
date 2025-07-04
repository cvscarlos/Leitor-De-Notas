import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { NotifyService } from '../services/notify/notify.service';
import { SessionService } from '../services/session/session.service';
import { CommonModule } from '@angular/common';
import { LoadingModule } from '../loading/loading.module';

@Component({
  imports: [CommonModule, LoadingModule],
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {
  private apiService = inject(ApiService);
  private notifyService = inject(NotifyService);
  sessionService = inject(SessionService);

  public loading = false;
  public showAcceptTermsButton = false;

  constructor() {}

  ngOnInit(): void {
    this.apiService.userMe().then((data) => {
      if (data) {
        this.showAcceptTermsButton = !data.termsAccepted;
      }
    });
  }

  public acceptingTerms(): void {
    this.loading = true;

    this.apiService.userAcceptTerms(() => {
      this.notifyService
        .success('Obrigado por aceitar os termos', 'Sua página será recarregada')
        .then(() => (window.location.href = '/'));
    });
  }
}
