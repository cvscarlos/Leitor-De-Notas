import { Component, OnInit } from '@angular/core';
import { faCopy, faSquarePlus, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ApiService } from 'src/app/services/api/api.service';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { DlombelloExportClass } from './dlombello-export';
import { ExcelExport } from './excel-export';
import { IsIframeService } from 'src/app/services/is-iframe/is-iframe.service';
import { Note } from 'src/types';
import { NotifyService } from 'src/app/services/notify/notify.service';
import NP from 'number-precision';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.less'],
})
export class ExportToolComponent implements OnInit {
  public faCopy = faCopy;
  public faSquarePlus = faSquarePlus;
  public faTrashAlt = faTrashAlt;

  public dlombelloExportString = '';
  public enableExport = false;
  public excelExportString = '';
  public groupByTicker = false;
  public removeOptionDT = false;
  public groupByTickerMsg = false;
  public isIframe = false;
  public provisionedIrrfDT = false;
  public provisionedIrrfST = false;

  private provIrrfMsg = false;
  private excelExport: ExcelExport;
  private dlombelloExportClass: DlombelloExportClass;

  constructor(
    private apiService: ApiService,
    private isIframeService: IsIframeService,
    private notesService: BrokerageNotesService,
    private notifyService: NotifyService,
    private numberFmt: NumberFormatService,
  ) {
    this.isIframe = this.isIframeService.isIframe();
    NP.enableBoundaryChecking(false);

    this.excelExport = new ExcelExport(this.numberFmt);
    this.dlombelloExportClass = new DlombelloExportClass(this.numberFmt);
  }

  ngOnInit(): void {
    this.notesService.noteCallback((note) => this.noteParser(note));

    this.apiService.userMe().then((data) => {
      this.provisionedIrrfDT = Boolean(data?.settings?.provisionedIrrfDT);
      this.provisionedIrrfST = Boolean(data?.settings?.provisionedIrrfST);
      this.groupByTicker = Boolean(data?.settings?.groupByTicker);
      this.removeOptionDT = Boolean(data?.settings?.removeOptionDT);
    });
  }

  public async copyFn(textarea: HTMLTextAreaElement): Promise<void> {
    textarea.select();
    await navigator.clipboard.writeText(textarea.value);
  }

  public cleanNotes(): void {
    this.notesService.clean();
    this.localCleanNotes();
  }

  public settingsChange({
    dayTrade,
    swingTrade,
    groupByTicker,
    removeOptionDT,
  }: {
    [x: string]: Event;
  }): void {
    if (dayTrade) {
      this.provisionedIrrfDT = Boolean((dayTrade.target as HTMLInputElement)?.checked);
      this.provisionedIrrfMsg(this.provisionedIrrfDT);
    } else if (swingTrade) {
      this.provisionedIrrfST = Boolean((swingTrade.target as HTMLInputElement)?.checked);
      this.provisionedIrrfMsg(this.provisionedIrrfST);
    } else if (groupByTicker) {
      this.groupByTicker = Boolean((groupByTicker.target as HTMLInputElement)?.checked);
      if (this.groupByTicker && !this.groupByTickerMsg) {
        this.notifyService.warning(
          'Atenção',
          'Utilize esta opção com cuidado.<br/><br/>Entenda melhor como funciona <a href="https://leitordenotas.customerly.help/leitura-de-notas/agrupar-operacoes-pelo-codigo-dos-ativos" target="_blank">clicando aqui</a>.',
        );
        this.groupByTickerMsg = true;
      }
    } else if (removeOptionDT) {
      this.removeOptionDT = Boolean((removeOptionDT.target as HTMLInputElement)?.checked);
      this.notifyService
        .info('Atenção', 'A página será recarregada para aplicar esta configuração.')
        .finally(() => {
          window.location.reload();
        });
    }

    this.apiService.userSettings({
      provisionedIrrfST: this.provisionedIrrfST,
      provisionedIrrfDT: this.provisionedIrrfDT,
      groupByTicker: this.groupByTicker,
      removeOptionDT: this.removeOptionDT,
    });

    this.recalcNotes();
  }

  sendJsonMessage(): void {
    try {
      window.parent.postMessage(
        JSON.stringify(this.dlombelloExportClass.getDlombelloExportObjects()),
        '*',
      );
    } catch (error) {
      this.notifyService.error(
        'Algo saiu errado ao tentar enviar os dados!',
        'A operação não foi completada.',
      );
      console.error(error);
    }
  }

  private localCleanNotes(): void {
    this.dlombelloExportClass.resetDlombelloExport();
    this.dlombelloExportString = '';
    this.excelExportString = '';
  }

  private recalcNotes(): void {
    this.localCleanNotes();
    this.notesService.getNotes().noteDetails.forEach((note) => this.noteParser(note));
  }

  private noteParser(note: Note): void {
    try {
      if (!note.trades) return;

      this.dlombelloExportString = this.dlombelloExportClass.dlombelloParser(note, {
        groupByTicker: this.groupByTicker,
        provisionedIrrfST: this.provisionedIrrfST,
        provisionedIrrfDT: this.provisionedIrrfDT,
      });

      this.excelExportString = this.excelExport.excelParser(note, this.excelExportString);

      this.enableExport = !!(this.dlombelloExportString.length || this.excelExportString.length);
    } catch (error) {
      console.error(error);
    }
  }

  private provisionedIrrfMsg(enabled: boolean): void {
    if (enabled && !this.provIrrfMsg) {
      this.notifyService.warning(
        'Atenção',
        'Utilize esta opção com cuidado.<br/><br/>Entenda melhor como funciona <a href="https://leitordenotas.customerly.help/leitura-de-notas/irrf-provisionado" target="_blank">clicando aqui</a>.',
      );
      this.provIrrfMsg = true;
    }
  }
}
