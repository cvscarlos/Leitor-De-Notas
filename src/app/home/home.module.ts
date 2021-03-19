import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import BrokerageNotesModule from './brokerage-notes/brokerage-notes.module';
import ExportToolModule from './export-tool/export-tool.module';
import HomeComponent from './home.component';
import UploadModule from './upload/upload.module';
import UserDocumentModule from './user-document/user-document.module';



@NgModule({
    declarations: [HomeComponent],
    imports: [
        BrokerageNotesModule,
        CommonModule,
        ExportToolModule,
        UploadModule,
        UserDocumentModule,
    ],
    exports: [HomeComponent]
})
export default class HomeModule { }
