import { Injectable } from '@angular/core';
import { Note } from 'src/types';
import { ApiService } from '../api/api.service';
import { UploadInterface } from './upload.interface';



type NotesArray = { notesList: UploadInterface[]; noteDetails: any[]; noteErrors: any[] };
type NoteCallback = (note: Note) => void;

@Injectable({
  providedIn: 'root',
})
export class BrokerageNotesService {
  private notesList: UploadInterface[] = [];
  private noteDetails: any[] = [];
  private noteErrors: any[] = [];
  private onNewNoteCallback: NoteCallback[] = [];

  constructor(
    private api: ApiService,
  ) { }

  public uploadFiles(files: FileList | null): void {
    if (!files) {
      return;
    }

    for (let i = 0; i < files.length; i++) { // eslint-disable-line @typescript-eslint/prefer-for-of
      this.upload(files[i]);
    }
  }

  public getNotes(): NotesArray {
    return {
      notesList: this.notesList,
      noteDetails: this.noteDetails,
      noteErrors: this.noteErrors,
    };
  }

  public noteCallback(onNewNoteCallback: NoteCallback): void {
    this.onNewNoteCallback.push(onNewNoteCallback);
  }

  public clean(): void {
    this.notesList.splice(0, this.notesList.length);
    this.noteDetails.splice(0, this.noteDetails.length);
    this.noteErrors.splice(0, this.noteErrors.length);
  }

  private upload(file: File): void {
    const newFile: UploadInterface = {
      filename: file.name,
      responseComplete: false,
      serverError: false,
      noteDetails: [],
      error: {},
      server: {},
    };
    this.notesList.push(newFile);

    const formData = new FormData();
    formData.append('brokerageNote', file, file.name);

    this.api.upload(formData).toPromise()
      .then(response => {
        newFile.server = response;
        this.parseDetails(response);
      })
      .catch(err => {
        newFile.serverError = true;
        newFile.error = err;
      })
      .finally(() => {
        newFile.responseComplete = true;
      });
  }

  private parseDetails(serverResponse: any): void {
    for (const n in serverResponse) {
      if (!Object.prototype.hasOwnProperty.call(serverResponse, n)) {
        continue;
      }

      const note = serverResponse[n];

      note._error = note._error || false;
      note._messages = note._messages || [];
      note.showNote = note._noteReadCompletely && note.trades && note.trades.length;
      this.noteDetails.push(note);

      if (note._messages.length) {
        this.noteErrors.push({
          _messages: note._messages,
          _page: note._page,
          fileName: note.fileName,
          number: note.number, // eslint-disable-line id-blacklist
        });
      }

      this.onNewNoteCallback.forEach(callback => { callback(note); });
    }
  }
}
