/* eslint-disable @typescript-eslint/no-explicit-any */

import { concatMap, share } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable, of, ReplaySubject } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import * as Sentry from '@sentry/angular';

import { environment } from 'src/environments/environment';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserData, UserTransactions } from 'src/types';

type Callback = (data: any) => void;
type RequestMethod = 'post' | 'delete' | 'patch' | 'get';
type BinanceCredentials = { binanceApiKey: string; binanceApiSecret: string };

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private notifyService = inject(NotifyService);
  private sessionService = inject(SessionService);

  private requestCache: { [endpoint: string]: ReplaySubject<any> } = {};
  private pendingCache: { [key: string]: boolean } = {};

  constructor() {}

  public upload(requestBody: any): Promise<any> {
    return firstValueFrom(
      this.request({ url: `${environment.apiUpload}/pvt/upload` }, requestBody, 'post', false),
    );
  }

  public uploadDualRequests(requestBody: any): Observable<any> {
    return this.request('/pvt/upload/set-content', requestBody, 'post', false).pipe(
      concatMap((data: any) => {
        if (!Boolean(data.noteContentId)) {
          return of(data);
        }
        return this.request(`/pvt/upload/content-id/${data.noteContentId}`, null, 'post', false);
      }),
    );
  }

  public token(token: string, sessionId: string): Observable<any> {
    return this.request('/token', token, 'post', false, sessionId);
  }

  public login(email: string): Observable<any> {
    return this.request('/login', email, 'post', false);
  }

  public getServerStatus(callback: Callback) {
    return this.cachedRequest('/status', true, 'get').subscribe((data) => callback(data));
  }

  public oAuthUrl(provider: API.OauthProvider, isIframe: boolean, callback: Callback) {
    return this.request(
      `/oauth/${provider}?domain=${location.host}&isIframe=${Number(Boolean(isIframe))}`,
    ).subscribe((data) => callback(data));
  }

  public oAuthToken(provider: API.OauthProvider, oauthProviderQuerystring: string) {
    return this.request(
      `/oauth/${provider}/callback${oauthProviderQuerystring}&domain=${location.host}`,
    );
  }

  public async userMe(): Promise<UserData | null> {
    if (!this.sessionService.isAuthenticated) return null;

    try {
      return await firstValueFrom(this.cachedRequest('/pvt/user/me', false));
    } catch (error) {
      this.notifyService
        .error('Não foi possível obter os dados do usuário.', 'Por atualize sua página')
        .then(() => {
          this.sessionService.logout();
          window.location.href = '/';
        });

      throw error;
    }
  }

  public userTransactions(): Promise<UserTransactions> {
    return firstValueFrom(this.cachedRequest('/pvt/user/transactions'));
  }

  public userUsageHistory(callback: Callback): void {
    this.request('/pvt/user/usage-history').subscribe((data) => callback(data));
  }

  public userDeleteAccount(callback: Callback): void {
    this.request('/pvt/user/delete', null, 'delete').subscribe((data) => callback(data));
  }

  public userDocumentSave(userDoc: string) {
    return firstValueFrom(this.request('/pvt/user/me', { userDoc }, 'patch'));
  }

  public userTransactionConnect(code: string) {
    return firstValueFrom(this.request('/pvt/user/connect-transaction', { code }));
  }

  public userMercadoPagoConnect(reference: string) {
    return firstValueFrom(this.request('/pvt/user/connect-mp-transaction', { reference }));
  }

  public userAcceptTerms(callback: Callback) {
    return this.request('/pvt/user/me/terms-accepted').subscribe((data) => callback(data));
  }

  public userMembersList(callback: Callback) {
    return this.request('/pvt/user/list-members').subscribe((data) => callback(data));
  }

  public userMemberSave(memberDoc: string) {
    return firstValueFrom(this.request('/pvt/user/add-member-document', { memberDoc }));
  }

  public userNewEmailSave(newEmail: string) {
    return this.request('/pvt/user/new-email', { newEmail });
  }

  public userNewEmailToken(newEmailToken: string) {
    return this.request('/pvt/user/new-email-token', { newEmailToken });
  }

  public userSettings(settings: UserData['settings']) {
    return firstValueFrom(this.request('/pvt/user/settings', { settings }));
  }

  public binanceFiatPayments(credentials: BinanceCredentials): Promise<API.BinanceResponse> {
    return firstValueFrom(this.request('/pvt/binance/fiat-pay', credentials, 'post', false));
  }

  public binanceFiatOrders(credentials: BinanceCredentials): Promise<API.BinanceResponse> {
    return firstValueFrom(this.request('/pvt/binance/fiat-order', credentials, 'post', false));
  }

  public binanceTradesOCO(credentials: BinanceCredentials): Promise<API.BinanceResponse> {
    return firstValueFrom(this.request('/pvt/binance/trades-oco', credentials, 'post', false));
  }

  public binanceTrades(credentials: BinanceCredentials): Promise<API.BinanceResponse> {
    return firstValueFrom(this.request('/pvt/binance/trades', credentials, 'post', false));
  }

  public binanceConversions(credentials: BinanceCredentials): Promise<API.BinanceResponse> {
    return firstValueFrom(this.request('/pvt/binance/conversions', credentials, 'post', false));
  }

  public getMercadoPagoLink(
    linkType: string,
    quantity: number,
    cpfList: Set<string> | null,
    callback: Callback,
  ) {
    const payload = {
      quantity,
      cpfList: cpfList ? [...cpfList] : [],
    };
    return this.request(`/pvt/mercado-pago/link/${linkType}`, payload).subscribe((data) =>
      callback(data),
    );
  }

  public connectUSAAccount(cpfCnpj: string, usaAccount: string) {
    return firstValueFrom(this.request('/pvt/user/connect-usa-account', { cpfCnpj, usaAccount }));
  }

  public async getSessionsInfo(): Promise<API.SessionItem[]> {
    const sessions = this.sessionService.getSessionList()?.split(',');
    if (!sessions) return [];
    return await firstValueFrom(this.request(`/pvt/session/list`, { sessions }));
  }

  public async createSession(token: string): Promise<any> {
    return await firstValueFrom(
      this.request(`/dlombello/create-session`, { token }, 'post', false),
    );
  }

  private request(
    endpoint: string | { url: string },
    payload: Record<string, unknown> | string | null = null,
    method: RequestMethod = 'post',
    handleError: boolean = true,
    sessionId: string | null = null,
  ): Observable<any> {
    const options = {
      body: payload,
      headers: { 'x-bggg-session': sessionId || this.sessionService.id },
    };
    const apiUrl =
      typeof endpoint === 'string' ? `${environment.apiServer}${endpoint}` : endpoint.url;
    const httpReq = this.http.request(method, apiUrl, options).pipe(share());

    httpReq.subscribe({
      error: (e) => {
        console.error('__LN Error:', e);
        Sentry.captureException(e);
        if (handleError) this.requestErrorHandler(e);
      },
    });

    return httpReq;
  }

  private cachedRequest(
    endpoint: string,
    handleError: boolean = true,
    method: RequestMethod = 'post',
  ): ReplaySubject<any> {
    this.requestCache[endpoint] = this.requestCache[endpoint] || new ReplaySubject(1);

    // Only make the request if it has not been made before and is not pending
    if (!this.requestCache[endpoint].observed && !this.pendingCache[endpoint]) {
      this.pendingCache[endpoint] = true;
      this.request(endpoint, null, method, handleError).subscribe({
        next: (n) => {
          this.requestCache[endpoint].next(n);
          this.requestCache[endpoint].complete();
          this.pendingCache[endpoint] = false;
        },
        error: (e) => {
          this.requestCache[endpoint].error(e);
          this.requestCache[endpoint].complete();
          this.pendingCache[endpoint] = false;
        },
      });
    }

    return this.requestCache[endpoint];
  }

  private requestErrorHandler(e: HttpErrorResponse) {
    const messages = e.error?._messages;
    if (messages?.length) {
      const title = (messages || ['---']).shift();
      const description = messages.join('\n');
      return this.notifyService.error(title, description);
    }

    return this.notifyService.error(
      'Erro inesperado!',
      'Por favor, atualize sua página e tente novamente',
    );
  }
}
