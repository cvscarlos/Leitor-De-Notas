import { Component, OnInit, inject } from '@angular/core';
import { faCopy, faTrashAlt, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { StatementService } from 'src/app/services/statement/statement.service';
import {
  StatementDetail,
  StatementError,
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
  public statements: StatementDetail[] = [];
  public statementErrors: StatementError[] = [];
  public isIframe = false;
  public broker = '';
  public fileName = '';

  constructor() {
    this.isIframe = this.isIframeService.isIframe();

    // Check for existing data before component initializes to avoid animation
    const existingData = this.statementService.getStatements();
    if (existingData.statementDetails.length > 0) {
      this.enableExport = true;
    }
  }

  ngOnInit(): void {
    this.statementService.statementCallback((details) => this.statementParser(details));

    // Load existing data from service
    const existingData = this.statementService.getStatements();
    if (existingData.statementDetails.length > 0) {
      this.statements = [...existingData.statementDetails];
      this.statementErrors = [...existingData.statementErrors];
      this.broker = this.statementService.getBroker();
      this.fileName = this.statementService.getFileName();
      this.generateExportString();
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
    this.enableExport = false;
  }

  public sendJsonMessage(): void {
    try {
      // Convert textarea content to JSON array format for DLP Invest
      const lines = this.exportString.split('\n').filter((line) => line.trim());
      const data = lines.map((line) => {
        const [stock, code, dlpType, value, , , broker] = line.split('\t');
        return {
          stock,
          code,
          dlpType,
          value: parseFloat(value.replace(',', '.')),
          broker,
        };
      });

      window.parent.postMessage(JSON.stringify(data), '*');
    } catch (error) {
      console.error(error);
      this.notifyService.error(
        'Algo saiu errado ao tentar enviar os dados!',
        'A operação não foi completada.',
      );
    }
  }

  private statementParser(details: StatementDetail[]): void {
    try {
      this.statements = [...this.statements, ...details];
      this.statementErrors = this.statementService.getStatements().statementErrors;
      this.broker = this.statementService.getBroker();
      this.fileName = this.statementService.getFileName();
      this.generateExportString();
      this.enableExport = this.exportString.length > 0;
    } catch (error) {
      console.error(error);
    }
  }

  private generateExportString(): void {
    const lines = this.statements.map((detail) => {
      return [
        detail.stock,
        detail.date,
        detail.dlpType,
        detail.value?.toString().replace('.', ','),
        detail.tax?.toString().replace('.', ','),
        '',
        this.broker,
      ].join('\t');
    });

    this.exportString = lines.join('\n');
  }
}
