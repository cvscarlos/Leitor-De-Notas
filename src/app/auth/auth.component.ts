import { ApiService, OauthProvider } from '../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '../services/notify/notify.service';
import { SessionService } from '../services/session/session.service';
import { IsIframeService } from '../services/is-iframe/is-iframe.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit {
  public emailForm!: FormGroup;
  public emailFormSent = false;
  public loading = false;
  public loginSlideState = '';
  public tokenForm!: FormGroup;
  private sessionId = '';

  constructor(
    public sessionService: SessionService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private notifyService: NotifyService,
    private isIframeService: IsIframeService,
  ) { }

  ngOnInit(): void {
    this.buildForms();
  }

  public submitEmailForm(): void {
    if (!this.emailForm) {
      return;
    }

    if (!this.emailForm.valid) {
      this.notifyService.error('Email inválido');
      return;
    }

    this.loading = true;

    this.api.login(this.emailForm.value).subscribe({
      next: (data: any) => {
        this.emailFormSent = true;
        this.loading = false;
        this.sessionId = data.session;
      },
      error: () => this.notifyService
        .error('Houve um problema ao tentar enviar sua mensagem', 'Por favor tente novamente.')
        .then(() => window.location.reload()),
    });
  }

  public submitTokenForm(): void {
    if (!this.tokenForm) {
      return;
    }

    if (!this.tokenForm.valid) {
      this.notifyService.error('Token inválido');
      return;
    }

    this.loading = true;

    this.api.token(this.tokenForm.value, this.sessionId).subscribe({
      next: () => {
        this.sessionService.id = this.sessionId;
        window.location.reload();
      },
      error: () => this.notifyService
        .error('Não foi possível validar o seu TOKEN', 'Por favor tente novamente.')
        .then(() => window.location.reload()),
    });
  }

  public redirectToOAuth(provider: OauthProvider) {
    this.api.oAuthUrl(provider, (data) => {
      if (!this.isIframeService.isIframe()) {
        window.location.href = data.url;
        return;
      }

      window.open(data.url);
      const htmlSpin = '<div><div class="spinner-border" role="status"><span class="sr-only">Carregando...</span></div></div>';
      this.notifyService.infoForceOpened('Aguardando a autorização', `${htmlSpin}Faça a autenticação na nova aba e quando estiver pronto, esta página irá atualizar automaticamente.`);

      localStorage.setItem('bgggSessionIframe', 'yes');

      setInterval(() => {
        if (this.sessionService.isAuthenticated) window.location.reload();
      }, 500);
    });
  }

  private buildForms(): void {
    this.emailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.minLength(5)]],
    });

    this.tokenForm = this.formBuilder.group({
      token: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }
}
