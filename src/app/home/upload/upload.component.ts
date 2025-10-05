import { Component, OnInit, inject } from '@angular/core';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UploadInterface } from 'src/app/services/brokerage-notes/upload.interface';
import { NgIf, NgFor } from '@angular/common';
import { UploadDirective } from './upload.directive';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  imports: [NgIf, UploadDirective, NgFor],
})
export class UploadComponent implements OnInit {
  sessionService = inject(SessionService);
  private notesService = inject(BrokerageNotesService);

  public uploads?: UploadInterface[];

  constructor() {}

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

  public hasServerErrors(): boolean {
    return Boolean(this.uploads && this.uploads.some((upload) => upload.serverError));
  }
}
