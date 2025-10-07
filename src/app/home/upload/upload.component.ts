import { Component, OnInit, inject } from '@angular/core';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { UploadInterface } from 'src/app/services/brokerage-notes/upload.interface';
import { UploadAreaComponent } from '../../shared-components/upload-area/upload-area.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  imports: [UploadAreaComponent],
})
export class UploadComponent implements OnInit {
  private notesService = inject(BrokerageNotesService);

  public uploads?: UploadInterface[];

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

  public getErrorMessage(upload: UploadInterface): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (upload.error as any).error?._message || 'Erro desconhecido';
  }

  public getErrorMessages(): string[] {
    if (!this.uploads) return [];
    return this.uploads
      .filter((upload) => upload.serverError)
      .map((upload) => this.getErrorMessage(upload));
  }
}
