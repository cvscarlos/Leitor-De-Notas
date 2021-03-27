import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerUnavailabilityMessageComponent } from './server-unavailability-message.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
    declarations: [ServerUnavailabilityMessageComponent],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [ServerUnavailabilityMessageComponent]
})
export class ServerUnavailabilityMessageModule { }
