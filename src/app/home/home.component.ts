import { Component, OnInit, inject } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { UserDocumentComponent } from './user-document/user-document.component';
import { UploadComponent } from './upload/upload.component';
import { StatementUploadComponent } from './statement-upload/statement-upload.component';
import { ExportToolComponent } from './export-tool/export-tool.component';
import { StatementExportComponent } from './statement-export/statement-export.component';
import { BrokerageNotesComponent } from './brokerage-notes/brokerage-notes.component';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons';

const TAB_NOTES = 'notas' as const;
const TAB_STATEMENTS = 'extratos' as const;
const ROUTE_STATEMENTS = '/extratos';
const ROUTE_HOME = '/';

type TabType = typeof TAB_NOTES | typeof TAB_STATEMENTS;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
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
    NgIf,
    FaIconComponent,
  ],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);

  readonly TAB_NOTES = TAB_NOTES;
  readonly TAB_STATEMENTS = TAB_STATEMENTS;
  readonly ROUTE_STATEMENTS = ROUTE_STATEMENTS;
  readonly ROUTE_HOME = ROUTE_HOME;

  currentTab: TabType = TAB_NOTES;
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
    this.currentTab = url.includes(ROUTE_STATEMENTS) ? TAB_STATEMENTS : TAB_NOTES;
  }
}
