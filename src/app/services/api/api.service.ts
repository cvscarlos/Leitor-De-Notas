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
    return this.post('pvt/upload', requestBody, undefined, false);
  }

  public uploadDualRequests(requestBody: any): Observable<any> {
    return this.post('pvt/upload/set-content', requestBody, undefined, false).pipe(
      concatMap((data: any) => {
        if (!Boolean(data.noteContentId)) return of(data);

        return this.post(
          `pvt/upload/content-id/${data.noteContentId}`,
          undefined,
          undefined,
          false,
        );
      }),
    );
  }

  public token(token: string, sessionId: string): Observable<any> {
    return this.post('token', token, undefined, false, sessionId);
  }

  public login(email: string): Observable<any> {
    return this.post('login', email, undefined, false);
  }

  public getServerStatus(callback: Callback) {
    return this.cachedPost('status', true, 'get').subscribe((data) => callback(data));
  }

  public oAuthUrl(provider: OauthProvider, isIframe: boolean, callback: Callback) {
    return this.post(
      `oauth/${provider}?domain=${location.host}&isIframe=${Number(Boolean(isIframe))}`,
    ).subscribe((data) => callback(data));
  }

  public oAuthToken(provider: OauthProvider, oauthProviderQuerystring: string) {
    return this.post(
      `oauth/${provider}/callback${oauthProviderQuerystring}&domain=${location.host}`,
    );
  }

  public userMe(): Promise<UserData | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.sessionService.isAuthenticated) return resolve(undefined);

      this.cachedPost('pvt/user/me', false).subscribe({
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
    this.cachedPost('pvt/user/transactions').subscribe((data) => callback(data));
  }

  public userUsageHistory(callback: Callback): void {
    this.post('pvt/user/usage-history').subscribe((data) => callback(data));
  }

  public userDeleteAccount(callback: Callback): void {
    this.post('pvt/user/delete', undefined, 'delete').subscribe((data) => callback(data));
  }

  public userDocumentSave(userDoc: string) {
    return lastValueFrom(this.post('pvt/user/me', { userDoc }, 'patch'));
  }

  public userTransactionConnect(code: string) {
    return lastValueFrom(this.post('pvt/user/connect-transaction', { code }));
  }

  public userMercadoPagoConnect(reference: string) {
    return lastValueFrom(this.post('pvt/user/connect-mp-transaction', { reference }));
  }

  public userAcceptTerms(callback: Callback) {
    return this.post('pvt/user/me/terms-accepted').subscribe((data) => callback(data));
  }

  public userMembersList(callback: Callback) {
    return this.post('pvt/user/list-members').subscribe((data) => callback(data));
  }

  public userMemberSave(memberDoc: string) {
    return lastValueFrom(this.post('pvt/user/add-member-document', { memberDoc }));
  }

  public userNewEmailSave(newEmail: string) {
    return this.post('pvt/user/new-email', { newEmail });
  }

  public userNewEmailToken(newEmailToken: string) {
    return this.post('pvt/user/new-email-token', { newEmailToken });
  }

  public userSettings(settings: UserData['settings']) {
    return this.post('pvt/user/settings', { settings });
  }

  public binanceFiatTransactions(
    credentials: BinanceCredentials,
  ): Promise<Record<string, string>[]> {
    return lastValueFrom(this.post('pvt/binance/fiat', credentials));
  }

  public binanceTrades(credentials: BinanceCredentials): Promise<Record<string, string>[]> {
    return lastValueFrom(this.post('pvt/binance/trades', credentials));
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
    return this.post(`pvt/mercado-pago/link/${linkType}`, payload).subscribe((data) =>
      callback(data),
    );
  }

  public connectApexAccount(cpfCnpj: string, apexAccount: string) {
    return lastValueFrom(this.post('pvt/user/connect-apex-account', { cpfCnpj, apexAccount }));
  }

  private post(
    endpoint: string,
    payload?: Record<string, unknown> | string,
    method: RequestMethod = 'post',
    handleError: boolean = true,
    sessionId: string | null = null,
  ): Observable<any> {
    const options = {
      body: payload,
      headers: { 'x-bggg-session': sessionId || this.sessionService.id },
    };
    const httpReq = this.http
      .request(method, `${environment.apiServer}/${endpoint}`, options)
      .pipe(share());

    if (handleError) httpReq.subscribe({ error: (e) => this.requestErrorHandler(e) });

    return httpReq;
  }

  private cachedPost(
    endpoint: string,
    handleError: boolean = true,
    method: RequestMethod = 'post',
  ): ReplaySubject<any> {
    this.requestCache[endpoint] = this.requestCache[endpoint] || new ReplaySubject(1);

    if (!this.requestCache[endpoint].observed) {
      this.post(endpoint, undefined, method, handleError).subscribe({
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
