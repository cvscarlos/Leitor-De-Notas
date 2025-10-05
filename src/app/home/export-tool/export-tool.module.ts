import { CommonModule } from '@angular/common';
import { ExportToolComponent } from './export-tool.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    SharedDirectivesModule,
    NgbNavModule,
    FontAwesomeModule,
    ExportToolComponent,
  ],
  exports: [ExportToolComponent],
})
export class ExportToolModule {}
