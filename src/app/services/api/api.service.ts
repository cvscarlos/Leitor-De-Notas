import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { NotifyService } from '../notify/notify.service';
import { UserData } from 'src/types';



export type OauthProvider = 'google' | 'facebook' | 'microsoft';
type Callback = (data: any) => void;
type RequestMethod = 'post' | 'delete' | 'patch' | 'get';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private requestCache: { [endpoint: string]: ReplaySubject<any> } = {};

  constructor(
    private http: HttpClient,
    private notifyService: NotifyService,
    private sessionService: SessionService,
  ) { }

  public upload(requestBody: any): Observable<any> {
    return this.post('pvt/upload', requestBody, undefined, false);
  }

  public token(token: string, sessionId: string): Observable<any> {
    return this.post('token', token, undefined, false, sessionId);
  }

  public login(email: string): Observable<any> {
    return this.post('login', email, undefined, false);
  }

  public getServerStatus(callback: Callback) {
    return this.cachedPost('status', true, 'get').subscribe(data => callback(data));
  }

  public oAuthUrl(provider: OauthProvider, callback: Callback) {
    return this.post('oauth/' + provider).subscribe(data => callback(data));
  }

  public userMe(): Promise<UserData | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.sessionService.isAuthenticated) {
        return resolve(undefined);
      }

      this.cachedPost('pvt/user/me', false).subscribe({
        next: data => resolve(data),
        error: error => {
          this.notifyService.error('Não foi possível obter os dados do usuário.', 'Por atualize sua página').then(() => {
            this.sessionService.logout();
            window.location.href = '/';
          });
          reject(error);
        },
      });
    });
  }

  public userTransactions(callback: Callback): void {
    this.post('pvt/user/transactions').subscribe(data => callback(data));
  }

  public userUsageHistory(callback: Callback): void {
    this.post('pvt/user/usage-history').subscribe(data => callback(data));
  }

  public userDeleteAccount(callback: Callback): void {
    this.post('pvt/user/delete', null, 'delete').subscribe(data => callback(data));
  }

  public userDocumentSave(userDoc: string) {
    return this.returnPromise(this.post('pvt/user/me', { userDoc }, 'patch'));
  }

  public userTransactionConnect(code: string, callback: Callback) {
    return this.post('pvt/user/connect-transaction', { code }).subscribe(data => callback(data));
  }

  public userMercadoPagoConnect(reference: string, callback: Callback) {
    return this.post('pvt/user/connect-mp-transaction', { reference }).subscribe(data => callback(data));
  }

  public userAcceptTerms(callback: Callback) {
    return this.post('pvt/user/me/terms-accepted').subscribe(data => callback(data));
  }

  public userMembersList(callback: Callback) {
    return this.post('pvt/user/list-members').subscribe(data => callback(data));
  }

  public userMemberSave(memberDoc: string) {
    return this.returnPromise(this.post('pvt/user/add-member-document', { memberDoc }));
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

  public getMercadoPagoLink(linkType: string, quantity: number, cpfList: Set<string> | null, callback: Callback) {
    return this.post(`pvt/mercado-pago/link/${linkType}`, {
      quantity,
      cpfList: (cpfList ? [...cpfList] : [])
    }).subscribe(data => callback(data));
  }

  public associateAvenueAccount(cpfCnpj: string, avenueAccount: string) {
    return this.returnPromise(this.post('pvt/user/associate-avenue-account', { cpfCnpj, avenueAccount }));
  }

  private returnPromise(httpRequest: Observable<any>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      httpRequest.subscribe({
        next: data => resolve(data),
        error: err => reject(err)
      });
    });
  }

  private post(
    endpoint: string,
    payload: any = null,
    method: RequestMethod = 'post',
    handleError: boolean = true,
    sessionId: string | null = null
  ): Observable<any> {
    const httpReq = this.http.request(method, environment.apiServer + '/' + endpoint, {
      body: payload,
      headers: { 'x-bggg-session': sessionId || this.sessionService.id }
    }).pipe(share());

    if (handleError) {
      httpReq.subscribe({
        next: () => { },
        error: (e: HttpErrorResponse) => {
          const message = e.error && e.error._messages ? e.error && e.error._messages : [];
          if (message.length) this.notifyService.error(message.join('\n'));
          else this.notifyService.error('Erro inesperado!', 'Por favor, atualize sua página e tente novamente');
        },
      });
    }

    return httpReq;
  }

  private cachedPost(endpoint: string, handleError: boolean = true, method: RequestMethod = 'post'): ReplaySubject<any> {
    this.requestCache[endpoint] = this.requestCache[endpoint] || new ReplaySubject(1);

    if (!this.requestCache[endpoint].observed) {
      this.post(endpoint, null, method, handleError).subscribe({
        next: (n) => this.requestCache[endpoint].next(n),
        error: (e) => this.requestCache[endpoint].error(e),
      });
    }

    return this.requestCache[endpoint];
  }
}
