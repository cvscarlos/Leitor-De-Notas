import { CommonModule } from '@angular/common';
import { ExportToolComponent } from './export-tool.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';

@NgModule({
  declarations: [ExportToolComponent],
  imports: [CommonModule, SharedDirectivesModule, NgbNavModule, FontAwesomeModule],
  exports: [ExportToolComponent],
})
export class ExportToolModule {}
