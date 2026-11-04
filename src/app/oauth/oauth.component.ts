import { ApiService } from 'src/app/services/api/api.service';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { SessionService } from '../services/session/session.service';

const OAUTH_STATE_KEY = 'bgggOauthState';

@Component({
  selector: 'app-oauth',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    const params = new URLSearchParams(location.search);
    const isIframe = location.pathname.includes('oauth-i.html');

    // Esta página sempre abre o provedor como aba principal (no iframe, é a aba nova), então o
    // `state` guardado aqui está no mesmo sessionStorage quando o login volta
    const start = params.get('start');
    if (start === 'google' || start === 'microsoft') {
      const state = `${start}-${crypto.randomUUID()}`;
      sessionStorage.setItem(OAUTH_STATE_KEY, state);
      this.api.oAuthUrl(start, isIframe, (data) => {
        const url = new URL(data.url);
        url.searchParams.set('state', state);
        window.location.href = url.toString();
      });
      return;
    }

    // `state` diferente do guardado: o login não começou neste navegador
    const state = params.get('state');
    const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    sessionStorage.removeItem(OAUTH_STATE_KEY);
    if (!state || state !== expectedState) {
      this.message = 'Não foi possível confirmar o login. Tente entrar novamente.';
      return;
    }

    const provider: API.OauthProvider = state.startsWith('microsoft') ? 'microsoft' : 'google';
    this.api.oAuthToken(provider, `${location.search}&isIframe=${Number(isIframe)}`).subscribe({
      next: (data) => {
        this.sessionService.id = data.session;

        if (isIframe) {
          window.opener?.postMessage({ bgggSessionId: data.session }, location.origin);
          this.message = '✅ Sucesso! Você já pode fechar esta aba.';
          window.close();
        } else {
          window.location.href = '/';
        }
      },
    });
  }
}
