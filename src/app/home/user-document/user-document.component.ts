import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UntypedFormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-document',
  templateUrl: './user-document.component.html',
  styleUrls: ['./user-document.component.less'],
})
export class UserDocumentComponent implements OnInit {
  @ViewChild('modalContent') modalContent: ElementRef | undefined;

  public loading = false;
  public valid = true;

  constructor(
    private apiService: ApiService,
    private notifyService: NotifyService,
    private userService: UserService,
    public sessionService: SessionService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.apiService.userMe().then((data: any) => {
      const showModal = this.sessionService.isAuthenticated && !data.userDoc;
      if (showModal) {
        this.modalService.open(this.modalContent, { backdrop: 'static', keyboard: false });
      }
    });
  }

  public accountDelete(): void {
    this.userService.accountDelete(() => {
      this.loading = true;
    });
  }

  public submitUserDocumentForm(form: UntypedFormGroup) {
    if (form.status !== 'VALID') {
      const error = new Error('CPF/CNPJ inválido');
      console.error(error);
      this.notifyService.error(error.message);
      return;
    }

    this.loading = true;
    this.apiService
      .userDocumentSave(form.value.userDoc)
      .then((data) => {
        if (data.error)
          this.notifyService
            .success(data._messages.join('\n'))
            .then(() => window.location.reload());
        else
          this.notifyService
            .success('Dados atualizados com sucesso!')
            .then(() => window.location.reload());
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
