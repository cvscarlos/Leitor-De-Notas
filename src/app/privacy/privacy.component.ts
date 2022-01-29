import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { NotifyService } from '../services/notify/notify.service';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.less']
})
export class PrivacyComponent implements OnInit {

  public loading = false;
  public showAcceptTermsButton = false;

  constructor(
    private apiService: ApiService,
    private notifyService: NotifyService,
    public sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.apiService.userMe().then((data: any) => {
      this.showAcceptTermsButton = !data.termsAccepted;
    });
  }

  public acceptingTerms(): void {
    this.loading = true;

    this.apiService.userAcceptTerms(() => {
      this.notifyService.success('Obrigado por aceitar os termos', 'Sua página será recarregada')
        .then(() => window.location.href = '/');
    });
  }
}
