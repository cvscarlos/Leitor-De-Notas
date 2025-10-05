import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { UserDocumentComponent } from './user-document/user-document.component';
import { UploadComponent } from './upload/upload.component';
import { ExportToolComponent } from './export-tool/export-tool.component';
import { BrokerageNotesComponent } from './brokerage-notes/brokerage-notes.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    AuthComponent,
    UserDocumentComponent,
    UploadComponent,
    ExportToolComponent,
    BrokerageNotesComponent,
    RouterLink,
  ],
})
export class HomeComponent {}
