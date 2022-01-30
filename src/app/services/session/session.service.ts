import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionId = '';

  constructor(
    private cookies: CookieService,
  ) { }

  get isAuthenticated(): boolean {
    const cookie = this.getCookie();
    return cookie.length > 0;
  }

  set id(sessionId: string) {
    this.sessionId = sessionId;
    this.setCookie();
  }

  get id(): string {
    return this.sessionId;
  }

  logout(): void {
    this.sessionId = '';
    this.cookies.delete('bggg-session');
  }

  private setCookie(): void {
    this.cookies.set('bggg-session', this.sessionId, 14, '/');
  }

  private getCookie(): string {
    let value: string;

    if (this.sessionId.length) {
      value = this.sessionId;
    } else {
      value = this.cookies.get('bggg-session') || '';
      value = value.trim();

      if (value.length) {
        this.sessionId = value;
      }
    }

    return value;
  }
}
