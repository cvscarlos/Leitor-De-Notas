import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionId = '';

  get isAuthenticated(): boolean {
    const session = this.getSessionData();
    return session.length > 0;
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

  private getSessionData(): string {
    let sessionId = '';

    if (this.sessionId.length) {
      sessionId = this.sessionId;
    } else {
      sessionId = parseInt(localStorage.bgggSessionExpires) > Date.now()
        ? `${localStorage.bgggSessionId}`.trim()
        : '';
      if (sessionId.length) this.sessionId = sessionId;
    }

    return sessionId;
  }
}
