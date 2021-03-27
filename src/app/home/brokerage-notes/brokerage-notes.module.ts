import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerageNotesComponent } from './brokerage-notes.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
    declarations: [
        BrokerageNotesComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        BrokerageNotesComponent,
    ]
})
export class BrokerageNotesModule { }
