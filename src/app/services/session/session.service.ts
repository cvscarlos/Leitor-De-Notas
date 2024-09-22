import { Injectable } from '@angular/core';

const fourteenDays = 1000 * 60 * 60 * 24 * 14;

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
    localStorage.setItem('bgggSessionId', sessionId);
    localStorage.setItem('bgggSessionExpires', `${Date.now() + fourteenDays}`);
    this.sessionListAdd(sessionId);
  }

  get id(): string {
    return this.getSessionId();
  }

  logout(removeSessionFromList = true): void {
    if (removeSessionFromList) {
      this.sessionListRemove();
    }

    this.sessionId = '';
    delete localStorage.bgggSessionExpires;
    delete localStorage.bgggSessionId;
  }

  public getSessionList(): string {
    this.sessionListAdd(this.getSessionId());
    return localStorage.bgggSessions;
  }

  private sessionListAdd(sessionId: string): void {
    const sessions = (localStorage.bgggSessions || '').split(',');
    sessions.push(sessionId);
    localStorage.setItem('bgggSessions', [...new Set(sessions.filter(Boolean))].join(','));
  }

  private sessionListRemove(): void {
    const sessionId = this.getSessionId();
    const sessions: string[] = (localStorage.bgggSessions || '').split(',');
    localStorage.setItem('bgggSessions', sessions.filter((user) => user !== sessionId).join(','));
  }

  private getSessionId(): string {
    if (Boolean(this.sessionId)) return this.sessionId;

    const sessionId =
      parseInt(localStorage.bgggSessionExpires) > Date.now()
        ? String(localStorage.bgggSessionId).trim()
        : '';

    return Boolean(sessionId) ? sessionId : '';
  }
}
