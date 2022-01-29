import { Component, OnInit } from '@angular/core';
import { AccountMember } from 'src/types';
import { ApiService } from '../services/api/api.service';
import { BrokerageNotesService } from '../services/brokerage-notes/brokerage-notes.service';

@Component({
  selector: 'app-modal',
  templateUrl: './avenue-modal.component.html',
  styleUrls: ['./avenue-modal.component.less']
})
export class AvenueModalComponent implements OnInit {

  public showAvenueModal = false;
  public avenueAccount?: string;
  public membersList: AccountMember[] = [];
  public loading = true;

  constructor(
    private apiService: ApiService,
    private notesService: BrokerageNotesService,
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
}
