import { Component, OnInit, inject } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { UserDocumentComponent } from './user-document/user-document.component';
import { UploadComponent } from './upload/upload.component';
import { StatementUploadComponent } from './statement-upload/statement-upload.component';
import { ExportToolComponent } from './export-tool/export-tool.component';
import { StatementExportComponent } from './statement-export/statement-export.component';
import { BrokerageNotesComponent } from './brokerage-notes/brokerage-notes.component';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons';

// Tab constants - these values must match across the template
const NOTES_TAB = 'notas' as const;
const STATEMENTS_TAB = 'extratos' as const;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  imports: [
    AuthComponent,
    UserDocumentComponent,
    UploadComponent,
    StatementUploadComponent,
    ExportToolComponent,
    StatementExportComponent,
    BrokerageNotesComponent,
    RouterLink,
    RouterLinkActive,
    FaIconComponent,
  ],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);

  // Expose constants to template
  readonly NOTES_TAB = NOTES_TAB;
  readonly STATEMENTS_TAB = STATEMENTS_TAB;

  currentTab: typeof NOTES_TAB | typeof STATEMENTS_TAB = NOTES_TAB;
  faFilePdf = faFilePdf;
  faFileCsv = faFileCsv;

  ngOnInit(): void {
    this.updateCurrentTab();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateCurrentTab();
    });
  }

  private updateCurrentTab(): void {
    const url = this.router.url;
    this.currentTab = url.includes(`/${STATEMENTS_TAB}`) ? STATEMENTS_TAB : NOTES_TAB;
  }
}
