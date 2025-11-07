import { ApiService } from 'src/app/services/api/api.service';
import { Component, OnInit, inject } from '@angular/core';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-oauth',
  imports: [],
  templateUrl: './oauth.component.html',
})
export class OauthComponent implements OnInit {
  private api = inject(ApiService);
  private sessionService = inject(SessionService);

  public message = '';

  constructor() {}

  ngOnInit(): void {
    this.oAuthLogin();
  }

  private oAuthLogin(): void {
    const querystring = location.search.trim();
    const isIframe = location.pathname.includes('oauth-i.html');

    if (querystring.length <= 1) {
      this.message = 'Error';
      return;
    }

    const provider: API.OauthProvider = querystring.includes('state=microsoft')
      ? 'microsoft'
      : 'google';

    const finalQuerystring = `${querystring}&isIframe=${Number(isIframe)}`;
    this.api.oAuthToken(provider, finalQuerystring).subscribe({
      next: (data) => {
        this.sessionService.id = data.session;

        if (isIframe) {
          this.message = '✅ Sucesso! Você já pode fechar esta aba.';
          window.close();
        } else {
          window.location.href = '/';
        }
      },
    });
  }
}
