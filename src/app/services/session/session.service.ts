import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionId = '';

  get isAuthenticated(): boolean {
    return Boolean(this.getSessionId());
  }

  set id(sessionId: string) {
    this.sessionId = sessionId;
    this.setSessionData();
  }

  get id(): string {
    return this.sessionId;
  }

  logout(): void {
    this.sessionId = '';
    delete localStorage.bgggSessionExpires;
    delete localStorage.bgggSessionId;
  }

  private setSessionData(): void {
    localStorage.setItem('bgggSessionId', this.sessionId);
    localStorage.setItem('bgggSessionExpires', `${Date.now() + 1000 * 60 * 60 * 24 * 14}`);
  }

  private getSessionId(): string {
    if (Boolean(this.sessionId)) {
      return this.sessionId;
    }

    const sessionId = parseInt(localStorage.bgggSessionExpires) > Date.now()
      ? String(localStorage.bgggSessionId).trim()
      : '';
    if (Boolean(sessionId)) {
      localStorage.removeItem('bgggSessionIframe');
      return sessionId;
    }

    return '';
  }
}
