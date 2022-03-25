import { Component, DoCheck, OnInit } from '@angular/core';
import { NoteDetails, NoteError } from 'src/types';

import { BrokerageNotesService } from '../../services/brokerage-notes/brokerage-notes.service';
import { UploadInterface } from '../../services/brokerage-notes/upload.interface';
import { NumberFormatService } from '../../services/number-format/number-format.service';

@Component({
  selector: 'app-brokerage-notes',
  templateUrl: './brokerage-notes.component.html',
  styleUrls: ['./brokerage-notes.component.less'],
})
export class BrokerageNotesComponent implements OnInit, DoCheck {
  public noteDetails?: NoteDetails[];
  public noteErrors?: NoteError[];
  public notes?: UploadInterface[];
  public hasAnyNote = false;

  constructor(
    private notesService: BrokerageNotesService,
    public numberFormatService: NumberFormatService,
  ) { }

  ngOnInit(): void {
    const notesService = this.notesService.getNotes();
    this.notes = notesService.notesList;
    this.noteDetails = notesService.noteDetails;
    this.noteErrors = notesService.noteErrors;

    this.notesService.noteCallback((note) => {
      if (!this.hasAnyNote) {
        this.hasAnyNote = !!note?.showNote;
      }
    });
  }

  ngDoCheck(): void {
    if (this.hasAnyNote) this.hasAnyNote = !!this.noteDetails?.some((note) => note.showNote);
  }
}
