import { Component, OnInit } from '@angular/core';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UploadInterface } from 'src/app/services/brokerage-notes/upload.interface';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  standalone: false,
})
export class UploadComponent implements OnInit {
  public uploads?: UploadInterface[];

  constructor(
    public sessionService: SessionService,
    private notesService: BrokerageNotesService,
  ) {}

  ngOnInit(): void {
    this.uploads = this.notesService.getNotes().notesList;
  }

  public hasNotes(): boolean {
    return !!this.notesService.getNotes().notesList.length;
  }

  public handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const files = input.files as FileList;
    this.notesService.uploadFiles(files);

    input.value = '';
  }
}
