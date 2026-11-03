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
  private files = new Map<string, File>();
  // Arquivos que a API só mostra depois que a conta tiver CPF/CNPJ
  private filesAwaitingDoc = new Set<string>();
  private docRequestCallbacks: Array<(doc?: string) => void> = [];

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

  /** `doc` é o CPF/CNPJ lido da nota; vazio quando o PDF tem senha e o usuário precisa digitá-lo */
  public onDocRequest(callback: (doc?: string) => void): void {
    this.docRequestCallbacks.push(callback);
  }

  public resendFilesAwaitingDoc(): void {
    const names = this.filesAwaitingDoc;
    this.filesAwaitingDoc = new Set();
    const keep = <T>(list: T[], name: (item: T) => string) =>
      list.splice(0, list.length, ...list.filter((item) => !names.has(name(item))));
    keep(this.uploadsList, (u) => u.filename);
    keep(this.detailsList, (n) => n.fileName);
    keep(this.errorsList, (e) => e.fileName);
    names.forEach((name) => {
      const file = this.files.get(name);
      if (file) this.upload(file);
    });
  }

  private requestDoc(fileName: string, doc?: string): void {
    this.filesAwaitingDoc.add(fileName);
    this.docRequestCallbacks.forEach((callback) => callback(doc));
  }

  private upload(file: File): void {
    this.files.set(file.name, file);
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

  protected parseResponse(serverResponse: unknown, fileName: string): void {
    const response = serverResponse as Record<string, unknown>;
    // Check for generic upload error
    if (response.uploadGenericError) {
      const uploadError = response.uploadGenericError as UploadGenericError;
      if (uploadError._errorCode === 1103) this.requestDoc(fileName);
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
      if (note._errorCode === 1102) this.requestDoc(fileName, note.documentOnlyNumbers);
    }
  }
}
