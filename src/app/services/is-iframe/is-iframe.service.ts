import { Injectable, inject } from '@angular/core';
import { NotifyService } from '../notify/notify.service';
import { Router } from '@angular/router';

@Injectable()
export class IsIframeService {
  private notifyService = inject(NotifyService);
  private router = inject(Router);

  constructor() {}

  isIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  canActivate(): boolean {
    if (this.isIframe()) {
      this.router.navigate(['']);
      this.notifyService.warning(
        '',
        'Esta opção esta disponível apenas no site do Leitor de Notas.<br /><a href="" target="_blank">Clique aqui para abrir uma nova aba</a>',
      );
      return false;
    }

    return true;
  }
}
