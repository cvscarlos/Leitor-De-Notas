import { Note, NoteDetails, NoteError } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { Injectable, inject } from '@angular/core';
import { UploadInterface } from './upload.interface';

type NotesArray = {
  notesList: UploadInterface[];
  noteDetails: NoteDetails[];
  noteErrors: NoteError[];
};
type NoteCallback = (note: NoteDetails) => void;

@Injectable({
  providedIn: 'root',
})
export class BrokerageNotesService {
  private api = inject(ApiService);

  private notesList: UploadInterface[] = [];
  private noteDetails: NoteDetails[] = [];
  private noteErrors: NoteError[] = [];
  private onNewNoteCallback: NoteCallback[] = [];

  constructor() {}

  public uploadFiles(files: FileList | null): void {
    if (!files) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
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

    this.api
      .upload(formData)
      .then((res) => {
        const content = res.data || res;
        newFile.server = content;
        this.parseDetails(content);
      })
      .catch((err) => {
        newFile.serverError = true;
        newFile.error = err;
      })
      .finally(() => {
        newFile.responseComplete = true;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseDetails(serverResponse: any): void {
    for (const n in serverResponse) {
      if (!Object.prototype.hasOwnProperty.call(serverResponse, n)) continue;

      const noteApiResponse = serverResponse[n] as Note;

      const noteError = noteApiResponse._error || false;
      const noteMessages = noteApiResponse._messages || [];
      const showNote = !!(
        noteApiResponse._noteReadCompletely &&
        noteApiResponse.trades &&
        noteApiResponse.trades.length
      );
      const note: NoteDetails = {
        ...noteApiResponse,
        _error: noteError,
        _messages: noteMessages,
        showNote,
      };
      this.noteDetails.push(note);

      if (note._messages.length) {
        this.noteErrors.push({
          _messages: note._messages,
          _page: note._page,
          fileName: note.fileName,
          number: note.number,
        });
      }

      this.onNewNoteCallback.forEach((callback) => {
        callback(note);
      });
    }
  }
}
