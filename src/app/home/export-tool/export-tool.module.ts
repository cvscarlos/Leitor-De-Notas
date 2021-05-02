import { CommonModule } from '@angular/common';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ExportToolComponent } from './export-tool.component';
import { NgModule } from '@angular/core';



@NgModule({
    declarations: [ExportToolComponent],
    imports: [
        CommonModule,
        DirectivesModule,
    ],
    exports: [ExportToolComponent]
})
export class ExportToolModule { }
