import { Component, OnInit } from '@angular/core';
import { faCopy, faSquarePlus, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Note, NoteTrade } from 'src/types';
import { ApiService } from 'src/app/services/api/api.service';
import { BrokerageNotesService } from 'src/app/services/brokerage-notes/brokerage-notes.service';
import { IsIframeService } from 'src/app/services/is-iframe/is-iframe.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import NP from 'number-precision';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';

type DlombelloTrade = {
  brokerage: Note['brokerName'];
  BS: NoteTrade['BS'];
  currency: Note['currency'];
  date: Note['date'];
  IR?: number;
  operationType: NoteTrade['dlombelloOperationType'];
  price: NoteTrade['price'];
  quantity: NoteTrade['quantity'];
  securities: NoteTrade['securities'];
  tax: number;
};
type DlombelloExport = DlombelloTrade & { _sortKey?: string };
type GroupedTrades = { [groupId: string]: DlombelloTrade & { itemTotal: number, priceTotal: number } };

type DlombelloExportObject = {
  broker: Note['brokerName'];
  currency: Note['currency'];
  date: Note['date'];
  irrf: number;
  price: number;
  quantity: number;
  tax: number;
  ticker: NoteTrade['securities'];
  type: NoteTrade['dlombelloOperationType'];
};

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
  public groupByTickerMsg = false;
  public isIframe = false;
  public provisionedIrrfDT = false;
  public provisionedIrrfST = false;
  private dlombelloExport: DlombelloExport[] = [];
  private dlombelloExportObjects: DlombelloExportObject[] = [];
  private dlombelloTaxIgnoredTrades = ['AJ.POS'];
  private notNumberRegex = /[^0-9]+/g;
  private provIrrfMsg = false;

  constructor(
    private apiService: ApiService,
    private isIframeService: IsIframeService,
    private notesService: BrokerageNotesService,
    private notifyService: NotifyService,
    private numberFmt: NumberFormatService,
  ) {
    this.isIframe = this.isIframeService.isIframe();
    NP.enableBoundaryChecking(false);
  }

  ngOnInit(): void {
    this.notesService.noteCallback((note) => this.noteParser(note));

    this.apiService.userMe().then((data) => {
      this.provisionedIrrfDT = !!data?.settings?.provisionedIrrfDT;
      this.provisionedIrrfST = !!data?.settings?.provisionedIrrfST;
      this.groupByTicker = !!data?.settings?.groupByTicker;
    });
  }

  public copyFn(textarea: HTMLTextAreaElement): void {
    textarea.select();
    navigator.clipboard.writeText(textarea.value);
  }

  public cleanNotes(): void {
    this.notesService.clean();
    this.localCleanNotes();
  }

  public settingsChange({ dayTrade, swingTrade, groupByTicker }: { [x: string]: Event }): void {
    if (dayTrade) {
      this.provisionedIrrfDT = !!(dayTrade.target as HTMLInputElement)?.checked;
      this.provisionedIrrfMsg(this.provisionedIrrfDT);
    } else if (swingTrade) {
      this.provisionedIrrfST = !!(swingTrade.target as HTMLInputElement)?.checked;
      this.provisionedIrrfMsg(this.provisionedIrrfST);
    } else if (groupByTicker) {
      this.groupByTicker = !!(groupByTicker.target as HTMLInputElement)?.checked;
      if (this.groupByTicker && !this.groupByTickerMsg) {
        this.notifyService.warning('Atenção', 'Utilize esta opção com cuidado.<br/><br/>Entenda melhor como funciona <a href="https://leitordenotas.customerly.help/leitura-de-notas/agrupar-operacoes-pelo-codigo-dos-ativos" target="_blank">clicando aqui</a>.');
        this.groupByTickerMsg = true;
      }
    }

    this.apiService.userSettings({
      provisionedIrrfST: this.provisionedIrrfST,
      provisionedIrrfDT: this.provisionedIrrfDT,
      groupByTicker: this.groupByTicker,
    });

    this.recalcNotes();
  }

  sendJsonMessage(): void {
    try {
      window.parent.postMessage(JSON.stringify(this.dlombelloExportObjects), '*');
    } catch (error) {
      this.notifyService.error('Algo saiu errado ao tentar enviar os dados!', 'A operação não foi completada.');
      console.error(error);
    }
  }

  private localCleanNotes(): void {
    this.dlombelloExport = [];
    this.dlombelloExportString = '';
    this.excelExportString = '';
  }

  private recalcNotes(): void {
    this.localCleanNotes();
    this.notesService.getNotes().noteDetails.forEach(note => this.noteParser(note));
  }

  private noteParser(note: Note): void {
    try {
      if (!note.trades) {
        return;
      }

      this.dlombelloParser(note);
      this.excelParser(note);
      this.enableExport = !!(this.dlombelloExportString.length || this.excelExportString.length);
    } catch (error) {
      console.error(error);
    }
  }

  private provisionedIrrfMsg(enabled: boolean): void {
    if (enabled && !this.provIrrfMsg) {
      this.notifyService.warning('Atenção', 'Utilize esta opção com cuidado.<br/><br/>Entenda melhor como funciona <a href="https://leitordenotas.customerly.help/leitura-de-notas/irrf-provisionado" target="_blank">clicando aqui</a>.');
      this.provIrrfMsg = true;
    }
  }

  private excelParser(note: Note): void {
    const excelTrades = [...note.trades] as Array<NoteTrade & Partial<Omit<Note, 'trades'>>>;

    // Colocando dos dados da nota no primeiro item negociado
    Object.assign(
      excelTrades[0],
      note,
      { trades: undefined, IR: (note.IRRF < 0 ? note.IRRF : '') },
    );

    // Gerando o valor da textarea usada para exportar pra planilha
    const excelStrings: string[] = [];
    const type = note.type;
    excelTrades.forEach(excelTrade => {
      const { brokerageTax, tran, others } = excelTrade.fees || {};

      excelStrings.push([
        excelTrade.BS,
        excelTrade.marketType,
        excelTrade.time,
        excelTrade.securities,
        excelTrade.obs,
        this.numberFmt.br(excelTrade.BS === 'C' ? excelTrade.quantity : -excelTrade.quantity, 10, 0),
        this.numberFmt.br(excelTrade.price, 10, 2),
        this.numberFmt.br(excelTrade.itemTotal),
        excelTrade.DC,
        type,
        note.brokerName,
        note.number,
        note.date,
        this.numberFmt.br(excelTrade.netAmount),
        this.numberFmt.br(tran !== undefined ? tran : excelTrade.settlementTax),
        this.numberFmt.br(excelTrade.registrationTax),
        this.numberFmt.br(excelTrade.CBLC),
        this.numberFmt.br(excelTrade.optionsTax),
        this.numberFmt.br(excelTrade.ANATax),
        this.numberFmt.br(excelTrade.emolument),
        this.numberFmt.br(excelTrade.bovespaTotal),
        this.numberFmt.br(brokerageTax !== undefined ? brokerageTax : excelTrade.clearing),
        this.numberFmt.br(excelTrade.ISSTax),
        this.numberFmt.br(excelTrade.IRRF),
        this.numberFmt.br(others !== undefined ? others : excelTrade.bovespaOthers),
        brokerageTax !== undefined ? '' : this.numberFmt.br(excelTrade.brokerageTax),
        this.numberFmt.br(excelTrade.futureNetAmount),
        this.numberFmt.br(excelTrade.irrfDtProvisioned),
        this.numberFmt.br(excelTrade.irrfStProvisioned),
        note.currency,
      ].join('\t'));
    });

    if (!this.excelExportString.length) {
      this.excelExportString += [
        'C/V',
        'Tipo Mercado',
        'Prazo',
        'Título',
        'Obs',
        'Quantidade',
        'Preço',
        'Valor Operação',
        'D/C',
        'Nota Tipo',
        'Corretora',
        'Nota',
        'Data',
        '$ Líquido',
        'Taxa de Liquidação',
        'Taxa de Registro',
        'CBLC',
        'Taxa de Termo / Opções',
        'Taxa A.N.A.',
        'Emolumentos',
        'Total Bolsa',
        'Corretagem',
        'ISS',
        'IRRF',
        'Outras Taxas',
        'Total Corretagem / Despesas',
        '$ Líquido p/ D+x',
        'IRRF provisionado DT',
        'IRRF provisionado ST',
        'Moeda',
      ].join('\t');
    }

    this.excelExportString += `\n${excelStrings.join('\n')}`;
  }

  private marketTypeNormalizer(marketType: string): string {
    marketType = marketType.toUpperCase();
    if (marketType.includes('FRACION') || marketType.includes('VISTA') || marketType === 'FRA' || marketType === 'VIS') {
      return 'VISTA';
    }
    return marketType;
  }

  private observationNormalizer(obs: string): string {
    if (obs === '#' || obs === '#2') return '';
    return obs;
  }

  private dlombelloParser(note: Note): void {
    // Agrupando os negócios pelo ativo e tipo de operação para simplificar as linhas na planilha
    let tradesVol = 0;
    const groupedTrades: GroupedTrades = {};
    note.trades.forEach((trade: NoteTrade) => {
      const tradesGroupId = this.marketTypeNormalizer(trade.marketType)
        + trade.BS
        + trade.securities
        + (this.groupByTicker ? '_' : trade.price)
        + this.observationNormalizer(trade.obs);
      const { brokerageTax, tran, others } = trade.fees || {};

      groupedTrades[tradesGroupId] = groupedTrades[tradesGroupId] || {
        tax: brokerageTax !== undefined ? (brokerageTax + (tran || 0) + (others || 0)) : 0,
        currency: note.currency,
        // Cód. do Ativo
        securities: trade.securities,
        // Data da Transação
        date: note.date,
        // Tipo de Operação
        operationType: trade.dlombelloOperationType,
        // Quantidade
        quantity: 0,
        itemTotal: 0,
        // Preço / Ajuste
        price: trade.price,
        priceTotal: 0,
        // Corretora
        brokerage: note.brokerName,
        // Tipo de operação: compra ou venda
        BS: trade.BS, // eslint-disable-line @typescript-eslint/naming-convention
      };

      groupedTrades[tradesGroupId].quantity += trade.quantity;
      groupedTrades[tradesGroupId].itemTotal += trade.itemTotal;
      groupedTrades[tradesGroupId].priceTotal += NP.times(trade.quantity, trade.price);

      if (!this.dlombelloTaxIgnoredTrades.includes(groupedTrades[tradesGroupId].operationType || '---')) {
        tradesVol = NP.plus(tradesVol, Math.abs(trade.itemTotal));
      }
    });

    if (this.groupByTicker) {
      Object.keys(groupedTrades).forEach(key => {
        groupedTrades[key].price = NP.divide(groupedTrades[key].priceTotal, groupedTrades[key].quantity);
      });
    }

    if (!note.trades?.[0]?.fees) {
      this.dlombelloTaxCalculator(groupedTrades, note, tradesVol);
    }

    // Incluindo o valor do IR, separado por DT e ST
    let firstSellRow = null;
    let firstDTRow = null;
    for (const g in groupedTrades) {
      if (Object.prototype.hasOwnProperty.call(groupedTrades, g) && groupedTrades[g].BS === 'V') {
        if (!firstDTRow && groupedTrades[g].operationType === 'DT') firstDTRow = groupedTrades[g];
        else if (!firstSellRow) firstSellRow = groupedTrades[g];

        if (firstSellRow && firstDTRow) break;
      }
    }
    if (firstDTRow) firstDTRow.IR = this.provisionedIrrfDT ? Math.abs(note.irrfDtProvisioned) : 0;
    if (firstSellRow) firstSellRow.IR = this.provisionedIrrfST ? Math.abs(note.irrfStProvisioned) : 0;
    const anyFirstRow = (firstSellRow || firstDTRow);
    if (anyFirstRow) anyFirstRow.IR = (anyFirstRow.IR || 0) + (note.IRRF < 0 ? Math.abs(note.IRRF) : 0);

    // Adicionando os novos negócios a lista já existete
    this.dlombelloExport = this.dlombelloExport.concat(Object.values(groupedTrades));

    // Ordenando todos os negócios do campo de exportação
    this.dlombelloExport.sort((a, b) => {
      const exportA = this.generateSortStr(a);
      const exportB = this.generateSortStr(b);
      return exportA < exportB ? -1 : exportA > exportB ? 1 : 0;
    });

    // Gerando o valor da textarea usada para exportar pra planilha
    this.dlombelloExportString = this.dlombelloExport.map((dlombelloTrade) => {
      const exportObject:DlombelloExportObject = {
        ticker: dlombelloTrade.securities,
        date: dlombelloTrade.date,
        type: dlombelloTrade.operationType,
        quantity: dlombelloTrade.BS === 'C' ? dlombelloTrade.quantity : -dlombelloTrade.quantity,
        price: dlombelloTrade.price,
        tax: dlombelloTrade.tax,
        broker: dlombelloTrade.brokerage,
        irrf: dlombelloTrade.IR || 0,
        currency: dlombelloTrade.currency,
      };
      this.dlombelloExportObjects.push(exportObject);

      return ([
        exportObject.ticker,
        exportObject.date,
        exportObject.type,
        this.numberFmt.commaOnly(exportObject.quantity, 10, 0),
        this.numberFmt.commaOnly(exportObject.price, 6, 2),
        this.numberFmt.commaOnly(exportObject.tax),
        exportObject.broker,
        this.numberFmt.commaOnly(exportObject.irrf || null),
        exportObject.currency,
      ].join('\t').trim());
    }).join('\n').trim();
  }

  // Dividindo a taxa da nota proporcionalmente aos ativos agrupados
  private dlombelloTaxCalculator(groupedTrades: GroupedTrades, note: Note, tradesVol: number): void {
    let tgFirst = '---';
    let counter = 0;
    let taxVol = 0;
    const noteTax = Math.abs(note.allFees + (note.ISSTax < 0 ? note.ISSTax : 0));

    for (const gKey in groupedTrades) {
      if (!Object.prototype.hasOwnProperty.call(groupedTrades, gKey)) continue;
      const gTrade = groupedTrades[gKey];

      if (this.dlombelloTaxIgnoredTrades.includes(gTrade.operationType || '---')) continue;

      counter++;
      // ignoro o cálculo da taxa para o primeiro item
      if (counter === 1) {
        tgFirst = gKey;
        continue;
      }

      gTrade.tax = Math.round(((Math.abs(gTrade.itemTotal) * noteTax) / tradesVol) * 100) / 100;
      taxVol += gTrade.tax;
    }

    if (groupedTrades[tgFirst]) {
      groupedTrades[tgFirst].tax = Math.round((noteTax - taxVol) * 100) / 100;
    }
  }

  private generateSortStr(exportTrade: DlombelloExport): string {
    if (exportTrade._sortKey) {
      return exportTrade._sortKey;
    }

    const operTypeOrder = { 'C': 1, 'V': 2, 'DT': 3 };

    let out = '';
    out += exportTrade.date.split('/').reverse().join(''); // data
    out += exportTrade.brokerage; // corretora
    out += operTypeOrder[exportTrade.operationType as keyof typeof operTypeOrder] || '-'; // tipo de operação
    out += (exportTrade.BS === 'C' ? '+' : '-') + this.forceNumberSize(exportTrade.quantity); // quantidade
    out += (`__________${exportTrade.securities}`).slice(-10); // papel/ação
    out += this.forceNumberSize(exportTrade.price); // preço
    exportTrade._sortKey = out.toUpperCase();

    return exportTrade._sortKey;
  }

  private forceNumberSize(val: number | string): string {
    val = val.toString().replace(this.notNumberRegex, '');
    return (`0000000000${val}`).slice(-10);
  }
}
