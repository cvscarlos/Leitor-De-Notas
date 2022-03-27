import { Note, NoteDetails, NoteError } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { UploadInterface } from './upload.interface';



type NotesArray = { notesList: UploadInterface[]; noteDetails: NoteDetails[]; noteErrors: NoteError[] };
type NoteCallback = (note: NoteDetails) => void;

@Injectable({
  providedIn: 'root',
})
export class BrokerageNotesService {
  private notesList: UploadInterface[] = [];
  private noteDetails: NoteDetails[] = [];
  private noteErrors: NoteError[] = [];
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

    firstValueFrom(this.api.upload(formData))
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
      if (!Object.prototype.hasOwnProperty.call(serverResponse, n)) continue;

      const noteApiResponse = serverResponse[n] as Note;

      const noteError = noteApiResponse._error || false;
      const noteMessages = noteApiResponse._messages || [];
      const showNote = !!(noteApiResponse._noteReadCompletely && noteApiResponse.trades && noteApiResponse.trades.length);
      const note: NoteDetails = { ...noteApiResponse, _error: noteError, _messages: noteMessages, showNote };
      this.noteDetails.push(note);

      if (note._messages.length) {
        this.noteErrors.push({
          _messages: note._messages,
          _page: note._page,
          fileName: note.fileName,
          number: note.number,
        });
      }

      this.onNewNoteCallback.forEach(callback => { callback(note); });
    }
  }
}
