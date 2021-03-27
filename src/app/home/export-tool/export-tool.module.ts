import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ExportToolComponent } from './export-tool.component';



@NgModule({
    declarations: [
        ExportToolComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        ExportToolComponent
    ]
})
export class ExportToolModule { }
