import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { AccountMember } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { CpfCnpjPipe } from 'src/app/shared-pipes/cpf-cnpj/cpf-cnpj.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-modal',
  templateUrl: './usa-modal.component.html',
  providers: [CpfCnpjPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LoadingComponent, CpfCnpjPipe, FormsModule, NgxMaskDirective],
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
  public membersLimit = 0;
  public existingLinks: { usaAccount: string; cpf: string }[] = [];
  public newMemberDoc = '';
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
        this.membersLimit = data.membersLimit;
        this.existingLinks = this.membersList.flatMap((member) =>
          member.usaAccounts.map((usaAccount) => ({ usaAccount, cpf: member.cpf })),
        );
        this.loading = false;
      });

      if (this.showApexModal) {
        this.modalService.open(this.modalContent, { size: 'lg' });
      }
    });
  }

  public async associateAccount(member: AccountMember) {
    if (!this.usaAccount) return;

    const confirm = await this.notifyService.confirm(
      'Confirmar o vínculo?',
      `CPF: ${this.cpfCnpj.transform(member.cpf)}<br/>Conta EUA: ${this.usaAccount}`,
    );
    if (!confirm.isConfirmed) return;

    this.connectAccount(member.cpf, this.usaAccount);
  }

  public async associateNewMember() {
    if (!this.usaAccount) return;

    const memberDoc = this.newMemberDoc.replace(/\D+/g, '');
    if (memberDoc.length !== 11 && memberDoc.length !== 14) {
      this.notifyService.error('CPF/CNPJ inválido');
      return;
    }

    const confirm = await this.notifyService.confirm(
      'Confirmar o vínculo?',
      `CPF: ${this.cpfCnpj.transform(memberDoc)}<br/>Conta EUA: ${this.usaAccount}<br/><br/>` +
        'O CPF/CNPJ será cadastrado em sua conta e não poderá ser editado depois.',
    );
    if (!confirm.isConfirmed) return;

    this.loading = true;
    try {
      await this.apiService.userMemberSave(memberDoc);
    } catch {
      // o ApiService já exibe a mensagem de erro do servidor
      return;
    } finally {
      this.loading = false;
    }

    this.connectAccount(memberDoc, this.usaAccount);
  }

  private connectAccount(cpfCnpj: string, usaAccount: string) {
    this.loading = true;
    this.apiService
      .connectUSAAccount(cpfCnpj, usaAccount)
      .then(() => {
        this.notifyService
          .success('Vínculo criado com sucesso!', 'Sua página será atualizada.')
          .then(() => {
            window.location.reload();
          });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
