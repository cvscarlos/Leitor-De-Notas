import { ApiService } from 'src/app/services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oauth',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './oauth.component.html',
})
export class OauthComponent implements OnInit {
  public message = '';

  constructor(
    private api: ApiService,
    private sessionService: SessionService,
  ) {}

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
