import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { CpfCnpjPipe } from 'src/app/shared-pipes/cpf-cnpj/cpf-cnpj.pipe';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { UntypedFormGroup, FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-user-document',
  templateUrl: './user-document.component.html',
  styleUrls: ['./user-document.component.less'],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [CpfCnpjPipe],
  imports: [LoadingComponent, FormsModule],
})
export class UserDocumentComponent implements OnInit {
  private apiService = inject(ApiService);
  private notifyService = inject(NotifyService);
  private modalService = inject(NgbModal);
  private notesService = inject(BrokerageNotesService);
  private cpfCnpj = inject(CpfCnpjPipe);

  @ViewChild('modalContent') modalContent: ElementRef | undefined;

  public loading = false;
  public valid = true;
  private asking = false;
  private linked = false;
  private modal?: NgbModalRef;

  constructor() {}

  ngOnInit(): void {
    // A conta não pede CPF/CNPJ no cadastro: ele vem da primeira nota enviada
    this.notesService.onDocRequest(async (doc) => {
      // nota que chegou depois do vínculo: só reenvia
      if (this.linked) return this.notesService.resendFilesAwaitingDoc();
      if (this.asking) return;
      this.asking = true;

      if (!doc) {
        this.modal = this.modalService.open(this.modalContent);
        this.modal.result.catch(() => null).finally(() => (this.asking = false));
        return;
      }

      this.notifyService.infoForceOpened(
        'Vinculando o CPF/CNPJ da nota à sua conta',
        '<div class="spinner-border my-3" role="status"></div>' +
          `<p>${this.cpfCnpj.transform(doc)}<br />Aguarde, a nota vai aparecer em seguida.</p>`,
      );
      await this.saveDoc(doc);
      // fecha o aviso de espera; o de sucesso ou de erro, que ficou na fila, aparece em seguida
      this.notifyService.close();
      this.asking = false;
    });
  }

  public async submitUserDocumentForm(form: UntypedFormGroup) {
    if (form.status !== 'VALID') {
      const error = new Error('CPF/CNPJ inválido');
      console.error(error);
      this.notifyService.error(error.message);
      return;
    }

    if (await this.saveDoc(form.value.userDoc)) this.modal?.close();
  }

  private async saveDoc(doc: string): Promise<boolean> {
    this.loading = true;
    try {
      await this.apiService.userDocumentSave(doc);
      // O plano da conta só é montado quando o /me vê o CPF/CNPJ
      await this.apiService.userMe(true);
    } catch {
      // o ApiService já exibe a mensagem de erro do servidor
      return false;
    } finally {
      this.loading = false;
    }

    this.linked = true;
    this.notifyService.success(`CPF/CNPJ ${this.cpfCnpj.transform(doc)} vinculado à sua conta!`);
    this.notesService.resendFilesAwaitingDoc();
    return true;
  }
}
