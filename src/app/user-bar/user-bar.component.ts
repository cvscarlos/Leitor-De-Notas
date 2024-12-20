import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UserComponent } from 'src/app/user/user.component';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NotifyService } from '../services/notify/notify.service';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  standalone: false,
})
export class UserBarComponent extends UserComponent implements OnInit {
  public faUser = faUser;
  public addUserKey = '_addUser_';
  public loggedUsers: string[] = [];
  public sessionList: API.SessionItem[] = [];

  constructor(
    public override sessionService: SessionService,
    protected override apiService: ApiService,
    protected override router: Router,
    private notifyService: NotifyService,
  ) {
    super(apiService, sessionService, router);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.sessionService.isAuthenticated) {
      this.listAvailableUsers();
      this.modalAvailablePayments();
    }
  }

  public changeUser(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEmail = selectElement.value;
    if (!selectedEmail) return;

    if (selectedEmail === this.addUserKey) {
      this.sessionService.logout(false);
      window.location.href = '/';
      return;
    }

    const selectedSession = this.sessionList.find((session) => session.email === selectedEmail);
    if (!selectedSession) {
      const error = new Error('Sessão não encontrada');
      console.error(error);
      this.notifyService.error(error.message);
      return;
    }

    this.sessionService.setSession(selectedSession.sessionId, selectedSession.expiresAt);
    window.location.href = '/';
  }

  public logout(): void {
    this.sessionService.logout();
    window.location.href = '/';
  }

  private async listAvailableUsers() {
    const sessions = await this.apiService.getSessionsInfo();
    sessions.forEach((session) => {
      this.loggedUsers.push(session.email);
    });
    this.sessionList = sessions;
  }

  private modalAvailablePayments() {
    const sawAvailablePayment = sessionStorage.getItem('bgggSawAvailablePayment');
    if (sawAvailablePayment) return;

    this.apiService.userTransactions(async ({ response }) => {
      const availablePayment = response.find((transaction) => !transaction.inUse);
      if (!availablePayment) return;

      const { isConfirmed } = await this.notifyService.confirm(
        'Você possui um pagamento disponível!',
        'Deseja associar a sua conta?',
      );
      if (isConfirmed) this.router.navigate(['minha-conta']);
      else sessionStorage.setItem('bgggSawAvailablePayment', '1');
    });
  }
}
