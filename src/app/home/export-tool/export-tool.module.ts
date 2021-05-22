import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';
import { ExportToolComponent } from './export-tool.component';
import { NgModule } from '@angular/core';



@NgModule({
    declarations: [ExportToolComponent],
    imports: [
        CommonModule,
        SharedDirectivesModule,
    ],
    exports: [ExportToolComponent]
})
export class ExportToolModule { }
