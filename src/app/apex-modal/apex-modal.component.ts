import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountMember } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { CpfCnpjPipe } from 'src/app/shared-pipes/cpf-cnpj/cpf-cnpj.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-modal',
  templateUrl: './apex-modal.component.html',
  styleUrls: ['./apex-modal.component.less'],
  providers: [CpfCnpjPipe],
})
export class ApexModalComponent implements OnInit {
  @ViewChild('modalContent') modalContent: ElementRef | undefined;

  public showApexModal = false;
  public apexAccount?: string;
  public membersList: AccountMember[] = [];
  public loading = true;

  constructor(
    private apiService: ApiService,
    private cpfCnpj: CpfCnpjPipe,
    private notesService: BrokerageNotesService,
    private notifyService: NotifyService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.notesService.noteCallback((note) => {
      if (this.showApexModal) return;

      this.showApexModal = note._errorCode == 1101;
      if (!this.showApexModal) return;

      this.apexAccount = note.apexAccount;

      this.apiService.userMembersList((data: any) => {
        this.membersList = data.members;
        this.loading = false;
      });

      if (this.showApexModal) {
        this.modalService.open(this.modalContent);
      }
    });
  }

  public async associateAccount(member: AccountMember) {
    if (!this.apexAccount) return;

    const confirm = await this.notifyService.confirm(
      'Você deseja mesmo associar esta conta?',
      `CPF: ${this.cpfCnpj.transform(member.cpf)}<br/>Apex: ${this.apexAccount}`,
    );
    if (!confirm.isConfirmed) return;

    this.loading = true;
    this.apiService.connectApexAccount(member.cpf, this.apexAccount)
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
