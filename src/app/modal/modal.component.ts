import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { BrokerageNotesService } from '../services/brokerage-notes/brokerage-notes.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {

  public showAvenueModal = false;
  public avenueAccount?: string;
  public membersList = [];
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
