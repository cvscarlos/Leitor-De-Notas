import { ApiService, OauthProvider } from 'src/app/services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
})
export class OauthComponent implements OnInit {

  message = '';

  constructor(
    private api: ApiService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.oAuthLogin();
  }

  private oAuthLogin(): void {
    const querystring = location.search.trim();

    if (querystring.length <= 1) {
      this.message = 'Error';
      return;
    }

    let provider: OauthProvider = 'google';
    if (querystring.indexOf('state=Facebook') > -1)
      provider = 'facebook';
    else if (querystring.indexOf('state=microsoft') > -1)
      provider = 'microsoft';

    this.api.oAuthToken(provider, querystring).subscribe({
      next: (data) => {
        this.sessionService.id = data.session;

        if (localStorage.getItem('bgggSessionIframe') === 'yes') {
          localStorage.removeItem('bgggSessionIframe');
          this.message = '✅ Sucesso! Você já pode fechar esta aba.';
          window.close();
        } else {
          location.href = '/';
        }
      },
      error: (err) => {
        console.error({ err });
        this.message = '❌ Erro inesperado!';
      },
    });
  }

}
