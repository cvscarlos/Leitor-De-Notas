import { Component, OnInit } from '@angular/core';
import { AccountMember } from 'src/types';
import { ApiService } from '../services/api/api.service';
import { BrokerageNotesService } from '../services/brokerage-notes/brokerage-notes.service';
import { NotifyService } from '../services/notify/notify.service';
import { CpfCnpjPipe } from '../shared-pipes/cpf-cnpj/cpf-cnpj.pipe';

@Component({
  selector: 'app-modal',
  templateUrl: './avenue-modal.component.html',
  styleUrls: ['./avenue-modal.component.less'],
  providers: [CpfCnpjPipe]
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
      'CPF: ' + this.cpfCnpj.transform(member.cpf) + '<br/>Avenue: ' + this.avenueAccount
    );
    if (!confirm.isConfirmed) return;

    await this.apiService.associateAvenueAccount(member.cpf, this.avenueAccount);
  }
}
