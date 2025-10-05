import { Component, DoCheck, OnInit, inject } from '@angular/core';
import { NoteDetails, NoteError } from 'src/types';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';
import { UploadInterface } from 'src/app/services/brokerage-notes/upload.interface';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-brokerage-notes',
    templateUrl: './brokerage-notes.component.html',
    imports: [NgIf, NgFor],
})
export class BrokerageNotesComponent implements OnInit, DoCheck {
  private notesService = inject(BrokerageNotesService);
  numberFormatService = inject(NumberFormatService);

  public noteDetails?: NoteDetails[];
  public noteErrors?: NoteError[];
  public notes?: UploadInterface[];
  public hasAnyNote = false;

  constructor() {}

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
