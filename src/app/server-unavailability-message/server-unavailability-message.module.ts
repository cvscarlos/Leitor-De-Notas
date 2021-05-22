import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from '../shared-directives/shared-directives.module';
import { NgModule } from '@angular/core';
import { ServerUnavailabilityMessageComponent } from './server-unavailability-message.component';



@NgModule({
    declarations: [ServerUnavailabilityMessageComponent],
    imports: [
        CommonModule,
        SharedDirectivesModule,
    ],
    exports: [ServerUnavailabilityMessageComponent]
})
export class ServerUnavailabilityMessageModule { }
