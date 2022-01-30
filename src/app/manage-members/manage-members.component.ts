import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountMember } from 'src/types';
import { ApiService } from '../services/api/api.service';
import { NotifyService } from '../services/notify/notify.service';

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.less'],
})
export class ManageMembersComponent implements OnInit {

  public loading = false;
  public membersList: AccountMember[] = [];
  public membersCpfList: Set<string> = new Set();
  public membersLimit = 1;
  public pendingMembers = 0;

  constructor(
    private apiService: ApiService,
    private notifyService: NotifyService,
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  public submitMemberForm(form: FormGroup) {
    if (form.status !== 'VALID') {
      this.notifyService.error('CPF/CNPJ inválido');
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
      .finally(() => this.loading = false);
  }

  public getOptionLink() {
    this.loading = true;
    this.apiService.getMercadoPagoLink('LN_001_EMA_A', this.membersCpfList.size, this.membersCpfList, (data) => {
      location.href = data.link;
    });
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
    this.apiService.userMembersList((data: any) => {
      this.membersList = data.members;
      this.pendingMembers = data.pendingPayment;
      this.membersLimit = data.membersLimit;
      this.loading = false;

      this.membersList.forEach(item => {
        if (!item.expires?.length) {
          this.membersCpfList.add(item.cpf);
        }
      });
    });
  }
}
