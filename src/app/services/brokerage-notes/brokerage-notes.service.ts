import { Note, NoteDetails, NoteError, UploadGenericError } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { Injectable, inject } from '@angular/core';
import { UploadInterface } from './upload.interface';
import { UploadBaseService } from '../upload-base/upload-base.service';

type NotesArray = {
  notesList: UploadInterface[];
  noteDetails: NoteDetails[];
  noteErrors: NoteError[];
};

@Injectable({
  providedIn: 'root',
})
export class BrokerageNotesService extends UploadBaseService<
  UploadInterface,
  NoteDetails,
  NoteError,
  NoteDetails
> {
  private api = inject(ApiService);

  constructor() {
    super();
  }

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
      notesList: this.uploadsList,
      noteDetails: this.detailsList,
      noteErrors: this.errorsList,
    };
  }

  public noteCallback(callback: (note: NoteDetails) => void): void {
    this.registerCallback(callback);
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

    this.uploadFile(file, newFile);
  }

  protected createFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('brokerageNote', file, file.name);
    return formData;
  }

  protected uploadToApi(formData: FormData): Promise<unknown> {
    return this.api.upload(formData);
  }

  protected parseResponse(serverResponse: unknown): void {
    const response = serverResponse as any;
    // Check for generic upload error
    if (response.uploadGenericError) {
      const uploadError = response.uploadGenericError as UploadGenericError;
      this.errorsList.push({
        _messages: uploadError._messages,
        fileName: uploadError.fileName,
        _page: undefined,
        number: '',
      });
      return;
    }

    for (const n in response) {
      if (!Object.prototype.hasOwnProperty.call(response, n)) continue;

      const noteApiResponse = response[n] as Note;

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
      this.detailsList.push(note);

      if (note._messages.length) {
        this.errorsList.push({
          _messages: note._messages,
          _page: note._page,
          fileName: note.fileName,
          number: note.number,
        });
      }

      this.notifyCallbacks(note);
    }
  }
}
