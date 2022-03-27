import { Component, OnInit } from '@angular/core';
import { AccountMember } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { CpfCnpjPipe } from 'src/app/shared-pipes/cpf-cnpj/cpf-cnpj.pipe';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-modal',
  templateUrl: './avenue-modal.component.html',
  styleUrls: ['./avenue-modal.component.less'],
  providers: [CpfCnpjPipe],
})
export class AvenueModalComponent implements OnInit {

  public showAvenueModal = false;
  public avenueAccount?: string;
  public membersList: AccountMember[] = [];
  public loading = true;

  constructor(
    private apiService: ApiService,
    private cpfCnpj: CpfCnpjPipe,
    private notesService: BrokerageNotesService,
    private notifyService: NotifyService,
  ) { }

  ngOnInit(): void {
    this.notesService.noteCallback((note) => {
      if (this.showAvenueModal) return;

      this.showAvenueModal = note._errorCode == 1101;
      this.avenueAccount = note.avenueAccount;

      this.apiService.userMembersList((data: any) => {
        this.membersList = data.members;
        this.loading = false;
      });
    });
  }

  public async associateAccount(member: AccountMember) {
    if (!this.avenueAccount) return;

    const confirm = await this.notifyService.confirm(
      'Você deseja mesmo associar esta conta?',
      `CPF: ${this.cpfCnpj.transform(member.cpf)}<br/>Avenue: ${this.avenueAccount}`,
    );
    if (!confirm.isConfirmed) return;

    this.loading = true;
    this.apiService.connectAvenueAccount(member.cpf, this.avenueAccount)
      .then(() => {
        this.notifyService.success('Conta associada com sucesso!', 'Sua página será atualizada.').then(() => {
          window.location.reload();
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
