import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerageNotesComponent } from './brokerage-notes.component';



@NgModule({
  declarations: [
    BrokerageNotesComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BrokerageNotesComponent,
  ]
})
export class BrokerageNotesModule { }
