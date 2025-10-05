import { ApiService } from 'src/app/services/api/api.service';
import { Component, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IsIframeService } from 'src/app/services/is-iframe/is-iframe.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';
import { NgIf } from '@angular/common';
import { FullPageLoadingComponent } from '../full-page-loading/full-page-loading.component';
import { SlideToggleDirective } from '../shared-directives/slide-toggle/slide-toggle.directive';
import { LoadingComponent } from '../loading/loading.component';
import { AutofocusDirective } from '../shared-directives/autofocus/autofocus.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
  imports: [
    NgIf,
    FullPageLoadingComponent,
    SlideToggleDirective,
    LoadingComponent,
    FormsModule,
    ReactiveFormsModule,
    AutofocusDirective,
  ],
})
export class AuthComponent implements OnInit {
  sessionService = inject(SessionService);
  private api = inject(ApiService);
  private formBuilder = inject(UntypedFormBuilder);
  private notifyService = inject(NotifyService);
  private isIframeService = inject(IsIframeService);

  public emailForm!: UntypedFormGroup;
  public emailFormSent = false;
  public loading = false;
  public loginSlideState = '';
  public tokenForm!: UntypedFormGroup;
  public queryToken = '';
  private sessionId = '';

  constructor() {
    this.queryToken = new URLSearchParams(window.location.search).get('token') || '';
  }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.minLength(5)]],
    });

    this.tokenForm = this.formBuilder.group({
      token: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });

    if (this.queryToken) {
      this.autoAuthenticateUser();
    }
  }

  public submitEmailForm(): void {
    if (!this.emailForm) {
      return;
    }

    if (!this.emailForm.valid) {
      const error = new Error('Email inválido');
      console.error(error);
      this.notifyService.error(error.message);
      return;
    }

    this.loading = true;

    this.api.login(this.emailForm.value).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (data: any) => {
        this.emailFormSent = true;
        this.loading = false;
        this.sessionId = data.session;
      },
      error: () =>
        this.notifyService
          .error('Houve um problema ao tentar enviar sua mensagem', 'Por favor tente novamente.')
          .then(() => window.location.reload()),
    });
  }

  public submitTokenForm(): void {
    if (!this.tokenForm) {
      return;
    }

    if (!this.tokenForm.valid) {
      const err = new Error('Token inválido');
      console.error(err);
      this.notifyService.error(err.message);
      return;
    }

    this.loading = true;

    this.api.token(this.tokenForm.value, this.sessionId).subscribe({
      next: () => {
        this.sessionService.id = this.sessionId;
        window.location.reload();
      },
      error: () =>
        this.notifyService
          .error('Não foi possível validar o seu TOKEN', 'Por favor tente novamente.')
          .then(() => window.location.reload()),
    });
  }

  public redirectToOAuth(provider: API.OauthProvider) {
    this.loading = true;
    const isIframe = this.isIframeService.isIframe();

    if (!isIframe) {
      this.api.oAuthUrl(provider, false, (data) => {
        window.location.href = data.url;
      });
      return;
    }

    this.api.oAuthUrl(provider, isIframe, (data) => {
      const loginWindow = window.open(data.url);

      const htmlSpin =
        '<div><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
      this.notifyService.infoForceOpened(
        'Aguardando a autorização',
        `${htmlSpin}Faça a autenticação na nova aba e quando estiver pronto, esta página irá atualizar automaticamente.`,
      );

      const intervalId = setInterval(() => {
        const bgggSessionId = loginWindow?.localStorage?.getItem('bgggSessionId');
        if (bgggSessionId) this.sessionService.id = bgggSessionId;

        if (this.sessionService.isAuthenticated || loginWindow?.closed) {
          clearInterval(intervalId);
          window.location.reload();
        }
      }, 500);
    });
  }

  private async autoAuthenticateUser() {
    try {
      this.loading = true;
      const data = await this.api.createSession(this.queryToken);
      this.sessionService.id = data.session;
    } catch (error) {
      console.error(error);
    }
    window.location.href = '/';
  }
}
