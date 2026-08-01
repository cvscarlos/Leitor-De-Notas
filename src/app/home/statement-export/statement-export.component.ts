import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { faCopy, faTrashAlt, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { StatementService } from 'src/app/services/statement/statement.service';
import {
  StatementDetail,
  StatementError,
  StatementPosition,
  StatementBatch,
} from 'src/app/services/statement/statement-upload.interface';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';
import { SlideToggleDirective } from '../../shared-directives/slide-toggle/slide-toggle.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

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
  currency: string;
};

type StatementWithContext = StatementDetail & {
  broker: string;
  fileName: string;
};

type PositionRow = {
  asset: string;
  type: string;
  date: string;
  quantity: string;
  price: string;
  value: string;
  rateType: string;
  rateValue: string;
  broker: string;
};

@Component({
  selector: 'app-statement-export',
  templateUrl: './statement-export.component.html',
  styleUrls: ['./statement-export.component.less'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    SlideToggleDirective,
    FaIconComponent,
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
  private numberFmt = inject(NumberFormatService);

  public faCopy = faCopy;
  public faTrashAlt = faTrashAlt;
  public faSquarePlus = faSquarePlus;

  public exportString = '';
  public enableExport = false;
  public statements: StatementWithContext[] = [];
  public positions: PositionRow[] = [];
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
    this.positions = [];
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
      this.positions = [
        ...this.positions,
        ...this.buildPositionRows(batch.positions || [], batch.broker),
      ];
      this.statementErrors = this.statementService.getStatements().statementErrors;
      this.generateExportString();
      this.enableExport = this.exportString.length > 0;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Renda fixa e fundos só são exibidos: a DLP ainda não importa essas posições,
   * então não entram na área de exportação.
   */
  private buildPositionRows(positions: StatementPosition[], broker: string): PositionRow[] {
    return positions.map((position) => ({
      // fundo é identificado pelo CNPJ, Tesouro pelo código da DLP, os demais pelo papel
      asset: position.cnpj || position.asset || position.name,
      type: position.sourceType,
      date: position.date,
      quantity: this.numberFmt.br(position.quantity, 8, 0),
      price: this.numberFmt.br(position.price, 8, 2),
      value: this.numberFmt.br(position.value),
      rateType: position.index || '-',
      rateValue: this.rateValue(position),
      broker,
    }));
  }

  private rateValue(position: StatementPosition): string {
    // percentual do índice ("110% do CDI") x taxa somada a ele ("IPCA + 7,74%")
    if (position.indexPercent) {
      return `${this.numberFmt.br(position.indexPercent, 2, 0)}%`;
    }
    if (!position.additionalRate) return '-';

    const rate = `${this.numberFmt.br(position.additionalRate)}%`;
    return position.index === 'PRE' ? rate : `+ ${rate}`;
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
        currency: detail.currency,
      };
      newStatementExportObjects.push(exportObject);

      return [
        exportObject.stock,
        exportObject.code,
        exportObject.dlpType,
        exportObject.value.toString().replace('.', ','),
        exportObject.tax.toString().replace('.', ','),
        // Coluna "Taxas" da DLP: os extratos não trazem custos de intermediação
        '',
        exportObject.currency,
        exportObject.broker,
      ].join('\t');
    });

    this.statementExportObjects = newStatementExportObjects;
    this.exportString = lines.join('\n');
  }
}
