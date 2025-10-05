import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AccountMember } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { CpfCnpjPipe } from 'src/app/shared-pipes/cpf-cnpj/cpf-cnpj.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { LoadingComponent } from '../loading/loading.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-modal',
    templateUrl: './usa-modal.component.html',
    providers: [CpfCnpjPipe],
    imports: [
        LoadingComponent,
        NgFor,
        CpfCnpjPipe,
    ],
})
export class USAModalComponent implements OnInit {
  private apiService = inject(ApiService);
  private cpfCnpj = inject(CpfCnpjPipe);
  private notesService = inject(BrokerageNotesService);
  private notifyService = inject(NotifyService);
  private modalService = inject(NgbModal);

  @ViewChild('modalContent') modalContent: ElementRef | undefined;

  public showApexModal = false;
  public usaAccount?: string;
  public membersList: AccountMember[] = [];
  public loading = true;

  constructor() {}

  ngOnInit(): void {
    this.notesService.noteCallback((note) => {
      if (this.showApexModal) return;

      this.showApexModal = note._errorCode == 1101;
      if (!this.showApexModal) return;

      this.usaAccount = note.usaAccount;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!this.usaAccount) return;

    const confirm = await this.notifyService.confirm(
      'Você deseja mesmo associar esta conta?',
      `CPF: ${this.cpfCnpj.transform(member.cpf)}<br/>Conta EUA: ${this.usaAccount}`,
    );
    if (!confirm.isConfirmed) return;

    this.loading = true;
    this.apiService
      .connectUSAAccount(member.cpf, this.usaAccount)
      .then(() => {
        this.notifyService
          .success('Conta associada com sucesso!', 'Sua página será atualizada.')
          .then(() => {
            window.location.reload();
          });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
