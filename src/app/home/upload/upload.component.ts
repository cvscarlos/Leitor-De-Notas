import { Component, OnInit } from '@angular/core';

import BrokerageNotes from '../../shared/brokerage-notes/brokerage-notes.interface';
import BrokerageNotesService from '../../shared/brokerage-notes/brokerage-notes.service';
import SessionService from '../../shared/session/session.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.less']
})
export default class UploadComponent implements OnInit {
    public notes: BrokerageNotes[] = [];

    constructor(
        public sessionService: SessionService,
        private notesService: BrokerageNotesService
    ) { }

    ngOnInit(): void {
        this.notes = this.notesService.getNotes().notesList;
    }

    public hasNotes(): boolean {
        return !!this.notesService.getNotes().notesList.length;
    }

    public handleFileInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        this.notesService.uploadFiles(files);
    }
}
