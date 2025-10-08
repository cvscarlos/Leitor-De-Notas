import { Component, OnInit, inject } from '@angular/core';
import { faCopy, faTrashAlt, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { StatementService } from 'src/app/services/statement/statement.service';
import {
  StatementDetail,
  StatementError,
  StatementBatch,
} from 'src/app/services/statement/statement-upload.interface';
import { SlideToggleDirective } from '../../shared-directives/slide-toggle/slide-toggle.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf, NgFor } from '@angular/common';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { IsIframeService } from 'src/app/services/is-iframe/is-iframe.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { ErrorLoggerComponent } from 'src/app/shared-components/error-logger/error-logger.component';

type StatementExportObject = {
  stock: string;
  code: string;
  dlpType: string;
  value: number;
  tax: number;
  broker: string;
  fileName: string;
};

type StatementWithContext = StatementDetail & {
  broker: string;
  fileName: string;
};

@Component({
  selector: 'app-statement-export',
  templateUrl: './statement-export.component.html',
  styleUrls: ['./statement-export.component.less'],
  imports: [
    SlideToggleDirective,
    FaIconComponent,
    NgIf,
    NgFor,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgbNavOutlet,
    ErrorLoggerComponent,
  ],
})
export class StatementExportComponent implements OnInit {
  private statementService = inject(StatementService);
  private isIframeService = inject(IsIframeService);
  private notifyService = inject(NotifyService);

  public faCopy = faCopy;
  public faTrashAlt = faTrashAlt;
  public faSquarePlus = faSquarePlus;

  public exportString = '';
  public enableExport = false;
  public statements: StatementWithContext[] = [];
  public statementErrors: StatementError[] = [];
  public isIframe = false;
  private statementExportObjects: StatementExportObject[] = [];

  constructor() {
    this.isIframe = this.isIframeService.isIframe();

    // Check for existing data before component initializes to avoid animation
    const existingData = this.statementService.getStatements();
    if (existingData.statementDetails.length > 0) {
      this.enableExport = true;
    }
  }

  ngOnInit(): void {
    this.statementService.statementCallback((batch) => this.statementParser(batch));

    // Load existing data from service
    const existingData = this.statementService.getStatements();
    if (existingData.statementDetails.length > 0) {
      // Note: On page reload, we lose broker/fileName context since it's not stored
      // This is acceptable - users will need to re-upload if they refresh
      this.statementErrors = [...existingData.statementErrors];
    }
  }

  public async copyFn(textarea: HTMLTextAreaElement): Promise<void> {
    textarea.select();
    await navigator.clipboard.writeText(textarea.value);
  }

  public cleanStatements(): void {
    this.statementService.clean();
    this.statements = [];
    this.statementErrors = [];
    this.exportString = '';
    this.statementExportObjects = [];
    this.enableExport = false;
  }

  public sendJsonMessage(): void {
    try {
      window.parent.postMessage(
        JSON.stringify({ dlpStatements: this.statementExportObjects }),
        '*',
      );
    } catch (error) {
      console.error(error);
      this.notifyService.error(
        'Algo saiu errado ao tentar enviar os dados!',
        'A operação não foi completada.',
      );
    }
  }

  private statementParser(batch: StatementBatch): void {
    try {
      // Add broker and fileName to each detail
      const detailsWithContext: StatementWithContext[] = batch.details.map((detail) => ({
        ...detail,
        broker: batch.broker,
        fileName: batch.fileName,
      }));

      this.statements = [...this.statements, ...detailsWithContext];
      this.statementErrors = this.statementService.getStatements().statementErrors;
      this.generateExportString();
      this.enableExport = this.exportString.length > 0;
    } catch (error) {
      console.error(error);
    }
  }

  private generateExportString(): void {
    const newStatementExportObjects: StatementExportObject[] = [];

    const lines = this.statements.map((detail) => {
      const exportObject: StatementExportObject = {
        stock: detail.stock,
        code: detail.date,
        dlpType: detail.dlpType,
        value: detail.value || 0,
        tax: detail.tax || 0,
        broker: detail.broker,
        fileName: detail.fileName,
      };
      newStatementExportObjects.push(exportObject);

      return [
        exportObject.stock,
        exportObject.code,
        exportObject.dlpType,
        exportObject.value.toString().replace('.', ','),
        exportObject.tax.toString().replace('.', ','),
        '',
        exportObject.broker,
      ].join('\t');
    });

    this.statementExportObjects = newStatementExportObjects;
    this.exportString = lines.join('\n');
  }
}
