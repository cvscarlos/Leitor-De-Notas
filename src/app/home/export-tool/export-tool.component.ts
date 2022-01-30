import { Component, OnInit } from '@angular/core';
import NP from 'number-precision';
import { ApiService } from 'src/app/services/api/api.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { Note, NoteTrade } from 'src/types';
import { BrokerageNotesService } from '../../services/brokerage-notes/brokerage-notes.service';
import { NumberFormatService } from '../../services/number-format/number-format.service';

type DlombelloExport = {
  _sortKey?: string,
  brokerage: Note['brokerName'],
  BS: NoteTrade['BS'],
  currency: Note['currency'],
  date: Note['date'],
  IR?: number,
  operationType: NoteTrade['dlombelloOperationType'],
  price: NoteTrade['price'],
  quantity: NoteTrade['quantity'],
  securities: NoteTrade['securities'],
  tax: number,
};
type GroupedTrades = {
  [groupId: string]: {
    brokerage: Note['brokerName'],
    BS: NoteTrade['BS'],
    currency: Note['currency'],
    date: Note['date'],
    IR?: number,
    itemTotal: NoteTrade['itemTotal'],
    operationType: NoteTrade['dlombelloOperationType'],
    price: NoteTrade['price'],
    quantity: NoteTrade['quantity'],
    securities: NoteTrade['securities'],
    tax: number,
  }
};

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.less'],
})
export class ExportToolComponent implements OnInit {
  public dlombelloExportString = '';
  public excelExportString = '';
  public enableExport = false;
  public provisionedIrrfDT = false;
  public provisionedIrrfST = false;
  private dlombelloExport: DlombelloExport[] = [];
  private notNumberRegex = /[^0-9]+/g;
  private provIrrfMsg = false;
  private dlombelloTaxIgnoredTrades = ['AJ.POS'];

  constructor(
    private notesService: BrokerageNotesService,
    private numberFmt: NumberFormatService,
    private notifyService: NotifyService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.notesService.noteCallback((note) => this.noteParser(note));

    this.apiService.userMe().then((data) => {
      this.provisionedIrrfDT = !!data?.settings?.provisionedIrrfDT;
      this.provisionedIrrfST = !!data?.settings?.provisionedIrrfST;
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

  public provisionedIRRF({ dayTrade, swingTrade }: { [x: string]: Event }): void {
    if (dayTrade) {
      this.provisionedIrrfDT = !!(dayTrade.target as HTMLInputElement)?.checked;
      this.provisionedIrrfMsg(this.provisionedIrrfDT);
    } else if (swingTrade) {
      this.provisionedIrrfST = !!(swingTrade.target as HTMLInputElement)?.checked;
      this.provisionedIrrfMsg(this.provisionedIrrfST);
    }

    if (dayTrade || swingTrade) {
      this.apiService.userSettings({ provisionedIrrfST: this.provisionedIrrfST, provisionedIrrfDT: this.provisionedIrrfDT });
    }

    this.recalcNotes();
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

  private dlombelloParser(note: Note): void {
    // Agrupando os negócios pelo ativo e tipo de operação para simplificar as linhas na planilha
    let tradesVol = 0;
    const groupedTrades: GroupedTrades = {};
    note.trades.forEach((trade: NoteTrade) => {
      const tradesGroupId = trade.marketType + trade.BS + trade.securities + trade.price + trade.obs as keyof GroupedTrades;
      const { brokerageTax, tran, others } = trade.fees || {};

      groupedTrades[tradesGroupId] = groupedTrades[tradesGroupId] || {
        tax: brokerageTax !== undefined ? (brokerageTax + (tran || 0) + (others || 0)) : 0,
        currency: note.currency,
        itemTotal: 0,
        // Cód. do Ativo
        securities: trade.securities,
        // Data da Transação
        date: note.date,
        // Tipo de Operação
        operationType: trade.dlombelloOperationType,
        // Quantidade
        quantity: 0,
        // Preço / Ajuste
        price: trade.price,
        // Corretora
        brokerage: note.brokerName,
        // Tipo de operação: compra ou venda
        BS: trade.BS, // eslint-disable-line @typescript-eslint/naming-convention
      };

      groupedTrades[tradesGroupId].quantity += trade.quantity;
      groupedTrades[tradesGroupId].itemTotal += trade.itemTotal;

      if (!this.dlombelloTaxIgnoredTrades.includes(groupedTrades[tradesGroupId].operationType || '---')) {
        tradesVol = NP.plus(tradesVol, Math.abs(trade.itemTotal));
      }
    });

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
      return ([
        dlombelloTrade.securities,
        dlombelloTrade.date,
        dlombelloTrade.operationType,
        this.numberFmt.commaOnly(dlombelloTrade.BS === 'C' ? dlombelloTrade.quantity : -dlombelloTrade.quantity, 10, 0),
        this.numberFmt.commaOnly(dlombelloTrade.price),
        this.numberFmt.commaOnly(dlombelloTrade.tax),
        dlombelloTrade.brokerage,
        this.numberFmt.commaOnly(dlombelloTrade.IR || null),
        dlombelloTrade.currency,
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
