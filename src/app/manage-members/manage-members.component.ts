import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api/api.service';
import NotifyService from '../shared/notify/notify.service';

@Component({
    selector: 'app-manage-members',
    templateUrl: './manage-members.component.html',
    styleUrls: ['./manage-members.component.less']
})
export default class ManageMembersComponent implements OnInit {

    public formLoading = false;
    public membersListLoading = false;
    public membersList = [];

    constructor(
        private apiService: ApiService,
        private notifyService: NotifyService,
    ) { }

    ngOnInit(): void {
        this.getMembers();
    }

    public submitMemberForm(form: FormGroup) {
        this.formLoading = true;

        this.apiService.userMemberSave(form.value.memberDoc.trim()).subscribe(() => {
            this.notifyService.success('Membro adicionado', () => {
                this.getMembers();
            });
            this.formLoading = false;
            form.reset();
        }, () => { this.formLoading = false; });
    }

    private getMembers() {
        this.membersListLoading = true;
        this.apiService.userMembersList((data: any) => {
            this.membersList = data.members;
            this.membersListLoading = false;
        });
    }
}
