import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../directives/directives.module';
import { NgModule } from '@angular/core';
import { ServerUnavailabilityMessageComponent } from './server-unavailability-message.component';



@NgModule({
    declarations: [ServerUnavailabilityMessageComponent],
    imports: [
        CommonModule,
        DirectivesModule,
    ],
    exports: [ServerUnavailabilityMessageComponent]
})
export class ServerUnavailabilityMessageModule { }
