import { Note, NoteTrade } from 'src/types';
import { NumberFormatService } from 'src/app/services/number-format/number-format.service';

export class ExcelExport {
  constructor(
    private numberFmt: NumberFormatService,
  ) { }

  public excelParser(note: Note, excelExportString:string): string {
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
        excelTrade.symbol,
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

    if (!excelExportString.length) {
      excelExportString += [
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

    excelExportString += `\n${excelStrings.join('\n')}`;
    return excelExportString;
  }
}