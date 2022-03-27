import { CommonModule } from '@angular/common';
import { ExportToolComponent } from './export-tool.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [ExportToolComponent],
  imports: [
    CommonModule,
    SharedDirectivesModule,
    TabsModule.forRoot(),
    FontAwesomeModule,
  ],
  exports: [ExportToolComponent],
})
export class ExportToolModule { }
