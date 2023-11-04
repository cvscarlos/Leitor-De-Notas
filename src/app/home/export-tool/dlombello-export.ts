import { Note, NoteTrade } from 'src/types';
import NP from 'number-precision';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';

type DlombelloTrade = {
  brokerage: Note['brokerName'];
  noteNumber: string;
  BS: NoteTrade['BS'];
  currency: Note['currency'];
  date: Note['date'];
  IR?: number;
  operationType: NoteTrade['dlombelloOperationType'];
  price: NoteTrade['price'];
  quantity: NoteTrade['quantity'];
  symbol: NoteTrade['symbol'];
  tax: number;
};

type DlombelloExport = DlombelloTrade & { _sortKey?: string };

type DlombelloExportObject = {
  broker: Note['brokerName'];
  currency: Note['currency'];
  date: Note['date'];
  irrf: number;
  price: number;
  quantity: number;
  tax: number;
  ticker: NoteTrade['symbol'];
  type: NoteTrade['dlombelloOperationType'];
  noteNumber: string;
};

type GroupedTrades = {
  [groupId: string]: DlombelloTrade & { itemTotal: number; priceTotal: number };
};

type DlombelloParams = {
  groupByTicker: boolean;
  provisionedIrrfST: boolean;
  provisionedIrrfDT: boolean;
};

export class DlombelloExportClass {
  private dlombelloExport: DlombelloExport[] = [];
  private dlombelloTaxIgnoredTrades = ['AJ.POS'];
  private notNumberRegex = /[^0-9]+/g;
  private dlombelloExportObjects: DlombelloExportObject[] = [];

  constructor(private numberFmt: NumberFormatService) {}

  public resetDlombelloExport() {
    this.dlombelloExport = [];
  }

  public getDlombelloExportObjects() {
    return this.dlombelloExportObjects;
  }

  public dlombelloParser(
    note: Note,
    { groupByTicker, provisionedIrrfST, provisionedIrrfDT }: DlombelloParams,
  ) {
    let tradesVolume = 0;
    const groupedTrades: GroupedTrades = {};
    note.trades.forEach((trade: NoteTrade) => {
      const tradeGroupId = this.createTradeGroupId(trade, groupByTicker);

      groupedTrades[tradeGroupId] =
        groupedTrades[tradeGroupId] || this.createGroupedTrade(trade, note);

      groupedTrades[tradeGroupId].quantity += trade.quantity;
      groupedTrades[tradeGroupId].itemTotal += trade.itemTotal;
      groupedTrades[tradeGroupId].priceTotal += NP.times(trade.quantity, trade.price);

      if (
        !this.dlombelloTaxIgnoredTrades.includes(groupedTrades[tradeGroupId].operationType || '---')
      ) {
        tradesVolume = NP.plus(tradesVolume, Math.abs(trade.itemTotal));
      }
    });

    if (groupByTicker) {
      Object.keys(groupedTrades).forEach((key) => {
        groupedTrades[key].price = NP.divide(
          groupedTrades[key].priceTotal,
          groupedTrades[key].quantity,
        );
      });
    }

    if (!note.trades[0]?.fees) {
      this.dlombelloTaxCalculator(groupedTrades, note, tradesVolume);
    }

    this.addIR(groupedTrades, note, provisionedIrrfST, provisionedIrrfDT);

    this.dlombelloExportObjects = this.createExportObjects(groupedTrades);

    return this.createExportString();
  }

  private createTradeGroupId(trade: NoteTrade, groupByTicker: boolean) {
    return (
      this.marketTypeNormalizer(trade.marketType) +
      trade.BS +
      trade.symbol +
      (groupByTicker ? '_' : trade.price) +
      this.observationNormalizer(trade.obs)
    );
  }

  private createGroupedTrade(trade: NoteTrade, note: Note) {
    const { brokerageTax, tran, others } = trade.fees || {};

    return {
      tax: brokerageTax !== undefined ? brokerageTax + (tran || 0) + (others || 0) : 0,
      currency: note.currency,
      noteNumber: note.isFakeNumber ? 'N/D' : note.number,
      // Cód. do Ativo
      symbol: trade.symbol,
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
  }

  private addIR(
    groupedTrades: GroupedTrades,
    note: Note,
    provisionedIrrfST: boolean,
    provisionedIrrfDT: boolean,
  ) {
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
    if (firstDTRow) firstDTRow.IR = provisionedIrrfDT ? Math.abs(note.irrfDtProvisioned) : 0;
    if (firstSellRow) firstSellRow.IR = provisionedIrrfST ? Math.abs(note.irrfStProvisioned) : 0;
    const anyFirstRow = firstSellRow || firstDTRow;
    if (anyFirstRow) {
      anyFirstRow.IR = (anyFirstRow.IR || 0) + (note.IRRF < 0 ? Math.abs(note.IRRF) : 0);
    }
  }

  private createExportObjects(groupedTrades: GroupedTrades): DlombelloExportObject[] {
    // Adicionando os novos negócios a lista já existete
    this.dlombelloExport = this.dlombelloExport.concat(Object.values(groupedTrades));

    // Ordenando todos os negócios do campo de exportação
    this.dlombelloExport.sort((a, b) => {
      const exportA = this.generateSortStr(a);
      const exportB = this.generateSortStr(b);
      return exportA < exportB ? -1 : exportA > exportB ? 1 : 0;
    });

    // Gerando o valor da textarea usada para exportar pra planilha
    return this.dlombelloExport.map((dlombelloTrade): DlombelloExportObject => {
      return {
        ticker: dlombelloTrade.symbol,
        date: dlombelloTrade.date,
        type: dlombelloTrade.operationType,
        quantity: dlombelloTrade.BS === 'C' ? dlombelloTrade.quantity : -dlombelloTrade.quantity,
        price: dlombelloTrade.price,
        tax: dlombelloTrade.tax,
        broker: dlombelloTrade.brokerage,
        irrf: dlombelloTrade.IR || 0,
        currency: dlombelloTrade.currency,
        noteNumber: dlombelloTrade.noteNumber,
      };
    });
  }

  private createExportString(): string {
    const rows = this.dlombelloExportObjects.map((exportObject) => {
      return [
        exportObject.ticker,
        exportObject.date,
        exportObject.type,
        this.numberFmt.commaOnly(exportObject.quantity, 10, 0),
        this.numberFmt.commaOnly(exportObject.price, 6, 2),
        this.numberFmt.commaOnly(exportObject.tax),
        exportObject.broker,
        this.numberFmt.commaOnly(exportObject.irrf || null),
        exportObject.currency,
        `NC:${exportObject.noteNumber}`,
      ]
        .join('\t')
        .trim();
    });

    return rows.join('\n').trim();
  }

  // Dividindo a taxa da nota proporcionalmente aos ativos agrupados
  private dlombelloTaxCalculator(
    groupedTrades: GroupedTrades,
    note: Note,
    tradesVol: number,
  ): void {
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

    const operTypeOrder = { C: 1, V: 2, DT: 3 };

    let out = '';
    out += exportTrade.date.split('/').reverse().join(''); // data
    out += exportTrade.brokerage; // corretora
    out += operTypeOrder[exportTrade.operationType as keyof typeof operTypeOrder] || '-'; // tipo de operação
    out += (exportTrade.BS === 'C' ? '+' : '-') + this.forceNumberSize(exportTrade.quantity); // quantidade
    out += `__________${exportTrade.symbol}`.slice(-10); // papel/ação
    out += this.forceNumberSize(exportTrade.price); // preço
    exportTrade._sortKey = out.toUpperCase();

    return exportTrade._sortKey;
  }

  private marketTypeNormalizer(marketType: string): string {
    marketType = marketType.toUpperCase();
    if (
      marketType.includes('FRACION') ||
      marketType.includes('VISTA') ||
      marketType === 'FRA' ||
      marketType === 'VIS'
    ) {
      return 'VISTA';
    }
    return marketType;
  }

  private observationNormalizer(obs: string): string {
    if (obs === '#' || obs === '#2') return '';
    return obs;
  }

  private forceNumberSize(val: number | string): string {
    val = val.toString().replace(this.notNumberRegex, '');
    return `0000000000${val}`.slice(-10);
  }
}
