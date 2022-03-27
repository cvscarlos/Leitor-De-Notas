import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServerUnavailabilityMessageComponent } from './server-unavailability-message.component';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';



@NgModule({
  declarations: [ServerUnavailabilityMessageComponent],
  imports: [
    CommonModule,
    SharedDirectivesModule,
  ],
  exports: [ServerUnavailabilityMessageComponent],
})
export class ServerUnavailabilityMessageModule { }
