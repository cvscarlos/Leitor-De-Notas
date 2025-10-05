import { Component, OnInit, inject } from '@angular/core';
import { faCopy, faTrashAlt, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { StatementService } from 'src/app/services/statement/statement.service';
import { StatementDetail } from 'src/app/services/statement/statement-upload.interface';
import { SlideToggleDirective } from '../../shared-directives/slide-toggle/slide-toggle.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf, NgFor } from '@angular/common';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { IsIframeService } from 'src/app/services/is-iframe/is-iframe.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

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
  public isIframe = false;
  private broker = '';

  constructor() {
    this.isIframe = this.isIframeService.isIframe();

    // Check for existing data before component initializes to avoid animation
    const existingStatements = this.statementService.getStatements().statementDetails;
    if (existingStatements.length > 0) {
      this.enableExport = true;
    }
  }

  ngOnInit(): void {
    this.statementService.statementCallback((details) => this.statementParser(details));

    // Load existing data from service
    const existingStatements = this.statementService.getStatements().statementDetails;
    if (existingStatements.length > 0) {
      this.statements = [...existingStatements];
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
      this.generateExportString();
      this.enableExport = this.exportString.length > 0;
    } catch (error) {
      console.error(error);
    }
  }

  private generateExportString(): void {
    const uploads = this.statementService.getStatements().statementsList;
    this.broker = uploads.length > 0 ? 'Avenue' : '';

    const lines = this.statements.map((detail) => {
      return [
        detail.stock,
        '45832',
        detail.dlpType,
        detail.value.toString().replace('.', ','),
        '',
        '',
        this.broker,
      ].join('\t');
    });

    this.exportString = lines.join('\n');
  }
}
