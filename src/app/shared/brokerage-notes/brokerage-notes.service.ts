import { Injectable } from '@angular/core';

import {ApiService} from '../api/api.service';
import BrokerageNotes from './brokerage-notes.interface';

type NotesArray = { notesList: BrokerageNotes[]; noteDetails: any[]; noteErrors: any[] };
type NoteCallback = (note: { x: any }) => void;

@Injectable({
    providedIn: 'root',
})
export default class BrokerageNotesService {
    private notesList: BrokerageNotes[] = [];
    private noteDetails: any[] = [];
    private noteErrors: any[] = [];
    private onNewNoteCallback: NoteCallback[] = [];

    constructor(
        private api: ApiService
    ) { }

    public uploadFiles(files: FileList | null): void {
        if (!files) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
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

    private upload(file: File): void {
        const newFile: BrokerageNotes = {
            filename: file.name,
            responseComplete: false,
            serverError: false,
            noteDetails: [],
            error: {},
            server: {}
        };
        this.notesList.push(newFile);

        const formData = new FormData();
        formData.append('brokerageNote', file, file.name);

        this.api.upload(formData).toPromise()
            .then(response => {
                newFile.server = response;
                this.parseDetails(response);
            })
            .catch(err => { newFile.serverError = true; newFile.error = err; })
            .finally(() => { newFile.responseComplete = true; });
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

            this.onNewNoteCallback.forEach(callback => { callback(note); });

            if (note._messages.length) {
                this.noteErrors.push({
                    _messages: note._messages,
                    _page: note._page,
                    fileName: note.fileName,
                    number: note.number, // eslint-disable-line id-blacklist
                });
            }
        }
    }
}
