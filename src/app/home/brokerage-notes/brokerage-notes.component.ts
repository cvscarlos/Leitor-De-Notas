import { Component, OnInit } from '@angular/core';

import BrokerageNotesService from '../../shared/brokerage-notes/brokerage-notes.service';
import BrokerageNotes from '../../shared/brokerage-notes/brokerage-notes.interface';
import NumberFormatService from '../../shared/number-format/number-format.service';

@Component({
    selector: 'app-brokerage-notes',
    templateUrl: './brokerage-notes.component.html',
    styleUrls: ['./brokerage-notes.component.less']
})
export default class BrokerageNotesComponent implements OnInit {
    public noteDetails: any[] = [];
    public noteErrors: any[] = [];
    public notes: BrokerageNotes[] = [];

    constructor(
        private notesService: BrokerageNotesService,
        public numberFormatService: NumberFormatService,
    ) { }

    ngOnInit(): void {
        const notesService = this.notesService.getNotes();
        this.notes = notesService.notesList;
        this.noteDetails = notesService.noteDetails;
        this.noteErrors = notesService.noteErrors;
    }
}
