import { Component, OnInit, inject } from '@angular/core';
import { AccountMember } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { FormsModule, UntypedFormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { CommonModule } from '@angular/common';
import { LoadingModule } from '../loading/loading.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';

@Component({
  selector: 'app-manage-members',
  imports: [CommonModule, FormsModule, LoadingModule, SharedPipesModule],
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.less'],
})
export class ManageMembersComponent implements OnInit {
  private apiService = inject(ApiService);
  private notifyService = inject(NotifyService);

  public loading = false;
  public membersList: AccountMember[] = [];
  public membersCpfList: Set<string> = new Set();
  public membersLimit = 1;
  public pendingMembers = 0;

  constructor() {}

  ngOnInit(): void {
    this.getMembers();
  }

  public submitMemberForm(form: UntypedFormGroup) {
    if (form.status !== 'VALID') {
      const error = new Error('CPF/CNPJ inválido');
      console.error(error);
      this.notifyService.error(error.message);
      return;
    }

    this.loading = true;
    this.apiService
      .userMemberSave(form.value.memberDoc.trim())
      .then(() => {
        this.notifyService.success('Membro adicionado').then(() => this.getMembers());
        this.loading = false;
        form.reset();
      })
      .finally(() => (this.loading = false));
  }

  public getOptionLink() {
    this.loading = true;
    this.apiService.getMercadoPagoLink(
      'LN_001_EMA_A',
      this.membersCpfList.size,
      this.membersCpfList,
      (data) => {
        window.location.href = data.link;
      },
    );
  }

  public membersListToggle(event: Event, cpf: string) {
    const elem = event.target as HTMLInputElement;
    if (elem?.checked) {
      this.membersCpfList.add(cpf);
    } else {
      this.membersCpfList.delete(cpf);
    }
  }

  private getMembers() {
    this.loading = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.apiService.userMembersList((data: any) => {
      this.membersList = data.members;
      this.pendingMembers = data.pendingPayment;
      this.membersLimit = data.membersLimit;
      this.loading = false;

      this.membersList.forEach((item) => {
        if (!item.expires?.length) {
          this.membersCpfList.add(item.cpf);
        }
      });
    });
  }
}
