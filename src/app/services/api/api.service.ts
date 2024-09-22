/* eslint-disable @typescript-eslint/no-explicit-any */

import { concatMap, share } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, Observable, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserData, UserTransactions } from 'src/types';

export type OauthProvider = 'google' | 'facebook' | 'microsoft';
type Callback = (data: any) => void;
type RequestMethod = 'post' | 'delete' | 'patch' | 'get';
type BinanceCredentials = { binanceApiKey: string; binanceApiSecret: string };
export type BinanceResponse = { errors: string[]; results: Record<string, string | number>[] };

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private requestCache: { [endpoint: string]: ReplaySubject<any> } = {};

  constructor(
    private http: HttpClient,
    private notifyService: NotifyService,
    private sessionService: SessionService,
  ) {}

  public upload(requestBody: any): Observable<any> {
    return this.request('/pvt/upload', requestBody, 'post', false);
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

  public oAuthUrl(provider: OauthProvider, isIframe: boolean, callback: Callback) {
    return this.request(
      `/oauth/${provider}?domain=${location.host}&isIframe=${Number(Boolean(isIframe))}`,
    ).subscribe((data) => callback(data));
  }

  public oAuthToken(provider: OauthProvider, oauthProviderQuerystring: string) {
    return this.request(
      `/oauth/${provider}/callback${oauthProviderQuerystring}&domain=${location.host}`,
    );
  }

  public userMe(): Promise<UserData | null> {
    return new Promise((resolve, reject) => {
      if (!this.sessionService.isAuthenticated) return resolve(null);

      this.cachedRequest('/pvt/user/me', false).subscribe({
        next: (data) => resolve(data),
        error: (error) => {
          this.notifyService
            .error('Não foi possível obter os dados do usuário.', 'Por atualize sua página')
            .then(() => {
              this.sessionService.logout();
              window.location.href = '/';
            });
          reject(error);
        },
      });
    });
  }

  public userTransactions(callback: (data: UserTransactions) => void): void {
    this.cachedRequest('/pvt/user/transactions').subscribe((data) => callback(data));
  }

  public userUsageHistory(callback: Callback): void {
    this.request('/pvt/user/usage-history').subscribe((data) => callback(data));
  }

  public userDeleteAccount(callback: Callback): void {
    this.request('/pvt/user/delete', null, 'delete').subscribe((data) => callback(data));
  }

  public userDocumentSave(userDoc: string) {
    return lastValueFrom(this.request('/pvt/user/me', { userDoc }, 'patch'));
  }

  public userTransactionConnect(code: string) {
    return lastValueFrom(this.request('/pvt/user/connect-transaction', { code }));
  }

  public userMercadoPagoConnect(reference: string) {
    return lastValueFrom(this.request('/pvt/user/connect-mp-transaction', { reference }));
  }

  public userAcceptTerms(callback: Callback) {
    return this.request('/pvt/user/me/terms-accepted').subscribe((data) => callback(data));
  }

  public userMembersList(callback: Callback) {
    return this.request('/pvt/user/list-members').subscribe((data) => callback(data));
  }

  public userMemberSave(memberDoc: string) {
    return lastValueFrom(this.request('/pvt/user/add-member-document', { memberDoc }));
  }

  public userNewEmailSave(newEmail: string) {
    return this.request('/pvt/user/new-email', { newEmail });
  }

  public userNewEmailToken(newEmailToken: string) {
    return this.request('/pvt/user/new-email-token', { newEmailToken });
  }

  public userSettings(settings: UserData['settings']) {
    return this.request('/pvt/user/settings', { settings });
  }

  public binanceFiatPayments(credentials: BinanceCredentials): Promise<BinanceResponse> {
    return lastValueFrom(this.request('/pvt/binance/fiat-pay', credentials, 'post', false));
  }

  public binanceFiatOrders(credentials: BinanceCredentials): Promise<BinanceResponse> {
    return lastValueFrom(this.request('/pvt/binance/fiat-order', credentials, 'post', false));
  }

  public binanceTradesOCO(credentials: BinanceCredentials): Promise<BinanceResponse> {
    return lastValueFrom(this.request('/pvt/binance/trades-oco', credentials, 'post', false));
  }

  public binanceTrades(credentials: BinanceCredentials): Promise<BinanceResponse> {
    return lastValueFrom(this.request('/pvt/binance/trades', credentials, 'post', false));
  }

  public binanceConversions(credentials: BinanceCredentials): Promise<BinanceResponse> {
    return lastValueFrom(this.request('/pvt/binance/conversions', credentials, 'post', false));
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
    return lastValueFrom(this.request('/pvt/user/connect-usa-account', { cpfCnpj, usaAccount }));
  }

  public async getSessionsInfo(): Promise<
    { email: string; sessionId: string; expiresAt: number }[]
  > {
    const sessions = this.sessionService.getSessionList();
    if (!sessions) return [];
    return await lastValueFrom(this.request(`/pvt/session/list`, { sessions }));
  }

  private request(
    endpoint: string,
    payload: Record<string, unknown> | string | null = null,
    method: RequestMethod = 'post',
    handleError: boolean = true,
    sessionId: string | null = null,
  ): Observable<any> {
    const options = {
      body: payload,
      headers: { 'x-bggg-session': sessionId || this.sessionService.id },
    };
    const httpReq = this.http
      .request(method, environment.apiServer + endpoint, options)
      .pipe(share());

    if (handleError) httpReq.subscribe({ error: (e) => this.requestErrorHandler(e) });

    return httpReq;
  }

  private cachedRequest(
    endpoint: string,
    handleError: boolean = true,
    method: RequestMethod = 'post',
  ): ReplaySubject<any> {
    this.requestCache[endpoint] = this.requestCache[endpoint] || new ReplaySubject(1);

    if (!this.requestCache[endpoint].observed) {
      this.request(endpoint, null, method, handleError).subscribe({
        next: (n) => this.requestCache[endpoint].next(n),
        error: (e) => this.requestCache[endpoint].error(e),
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
