import { BrokerageNotesComponent } from './brokerage-notes.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, BrokerageNotesComponent],
  exports: [BrokerageNotesComponent],
})
export class BrokerageNotesModule {}
