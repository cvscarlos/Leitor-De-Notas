import { Component, OnInit } from '@angular/core';
import NP from 'number-precision';

import { BrokerageNotesService } from '../../shared/brokerage-notes/brokerage-notes.service';
import { GenericObject } from '../../shared/generic-object.interface';
import { NumberFormatService } from '../../shared/number-format/number-format.service';



@Component({
    selector: 'app-export-tool',
    templateUrl: './export-tool.component.html',
    styleUrls: ['./export-tool.component.less']
})
export class ExportToolComponent implements OnInit {
    public dlombelloExportString = '';
    public excelExportString = '';
    public enableExport = false;
    private dlombelloExport: GenericObject[] = [];
    private notNumberRegex = /[^0-9]+/g;

    constructor(
        private notesService: BrokerageNotesService,
        private numberFormatService: NumberFormatService,
    ) { }

    ngOnInit(): void {
        this.notesService.noteCallback((note: GenericObject) => {
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
        });
    }

    public copyFn(textarea: HTMLTextAreaElement): void {
        textarea.select();
        document.execCommand('copy', false);
    }

    private excelParser(note: GenericObject): void {
        const excelTrades = [...note.trades];

        // Colocando dos dados da nota no primeiro item negociado
        Object.assign(
            excelTrades[0],
            note,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            { trades: null, fullText: null, IR: (note.IRRF < 0 ? note.IRRF : '') }
        );

        // Gerando o valor da textarea usada para exportar pra planilha
        const excelStrings: string[] = [];
        excelTrades.forEach(excelTrade => {
            excelStrings.push([
                excelTrade.BS,
                excelTrade.marketType,
                excelTrade.time,
                excelTrade.securities,
                excelTrade.obs,
                this.numberFormatService.br(excelTrade.BS === 'C' ? excelTrade.quantity : -excelTrade.quantity, 0),
                this.numberFormatService.br(excelTrade.price),
                this.numberFormatService.br(excelTrade.itemTotal),
                excelTrade.DC,
                excelTrade.type,
                note.broker,
                note.number,
                note.date,
                this.numberFormatService.br(excelTrade.netAmount),
                this.numberFormatService.br(excelTrade.settlementTax),
                this.numberFormatService.br(excelTrade.registrationTax),
                this.numberFormatService.br(excelTrade.CBLC),
                this.numberFormatService.br(excelTrade.optionsTax),
                this.numberFormatService.br(excelTrade.ANATax),
                this.numberFormatService.br(excelTrade.emolument),
                this.numberFormatService.br(excelTrade.bovespaTotal),
                this.numberFormatService.br(excelTrade.clearing),
                this.numberFormatService.br(excelTrade.ISSTax),
                this.numberFormatService.br(excelTrade.IRRF),
                this.numberFormatService.br(excelTrade.bovespaOthers),
                this.numberFormatService.br(excelTrade.brokerageTax),
                this.numberFormatService.br(excelTrade.futureNetAmount),
            ].join('\t'));
        });

        this.excelExportString += (this.excelExportString.length ? '\n' : '') + excelStrings.join('\n');
    }

    private dlombelloParser(note: GenericObject): void {
        // Agrupando os negócios pelo ativo e tipo de operação para simplificar as linhas na planilha
        let tradesVol = 0;
        const groupedTrades: GenericObject = {};
        note.trades.forEach((trade: GenericObject) => {
            const tradesGroupId = trade.marketType + trade.BS + trade.securities + trade.price + trade.obs;

            groupedTrades[tradesGroupId] = groupedTrades[tradesGroupId] || {
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
                brokerage: note.broker,
                // Tipo de operação: compra ou venda
                BS: trade.BS, // eslint-disable-line @typescript-eslint/naming-convention
            };

            groupedTrades[tradesGroupId].quantity += trade.quantity;
            groupedTrades[tradesGroupId].itemTotal += trade.itemTotal;

            tradesVol = NP.plus(tradesVol, Math.abs(trade.itemTotal));
        });

        // Dividindo a taxa da nota proporcionalmente aos ativos agrupados
        let tgFirst = '---';
        let counter = 0;
        let taxVol = 0;
        const noteTax = Math.abs(note.allFees + (note.ISSTax < 0 ? note.ISSTax : 0));

        for (const g in groupedTrades) {
            if (!Object.prototype.hasOwnProperty.call(groupedTrades, g)) {
                continue;
            }

            counter++;
            // ignoro o cálculo da taxa para o primeiro item
            if (counter === 1) {
                tgFirst = g;
                continue;
            }

            const TG = groupedTrades[g];
            TG.tax = Math.round((NP.times(Math.abs(TG.itemTotal), noteTax) / tradesVol) * 100) / 100;
            taxVol += TG.tax;
        }
        groupedTrades[tgFirst].tax = Math.round((noteTax - taxVol) * 100) / 100;

        // Colocando dos dados da nota no primeiro item negociado
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Object.assign(groupedTrades[tgFirst], { IR: (note.IRRF < 0 ? note.IRRF * -1 : null) });

        // Adicionando os novos negócios a lista já existete
        this.dlombelloExport = this.dlombelloExport.concat(Object.values(groupedTrades));

        // Ordenando todos os negócios do campo de exportação
        this.dlombelloExport.sort((a, b) => {
            const exportA = this.generateSortStr(a);
            const exportB = this.generateSortStr(b);
            return exportA < exportB ? -1 : exportA > exportB ? 1 : 0;
        });

        // Gerando o valor da textarea usada para exportar pra planilha
        const dlombelloStrings: string[] = [];
        this.dlombelloExport.forEach((dlombelloTrade: GenericObject) => {
            dlombelloStrings.push([
                dlombelloTrade.securities,
                dlombelloTrade.date,
                dlombelloTrade.operationType,
                this.numberFormatService.br(dlombelloTrade.BS === 'C' ? dlombelloTrade.quantity : -dlombelloTrade.quantity, 0),
                this.numberFormatService.br(dlombelloTrade.price),
                this.numberFormatService.br(dlombelloTrade.tax),
                dlombelloTrade.brokerage,
                this.numberFormatService.br(dlombelloTrade.IR || null),
            ].join('\t'));
        });
        this.dlombelloExportString = dlombelloStrings.join('\n');
    }

    private generateSortStr(exportTrade: GenericObject): string {
        if (exportTrade._sortKey) {
            return exportTrade._sortKey;
        }

        let out = exportTrade.date.split('/').reverse().join(''); // data
        out += exportTrade.brokerage; // corretora
        out += (exportTrade.BS === 'C' ? '+' : '-') + this.forceNumberSize(exportTrade.quantity); // quantidade
        out += ('__________' + exportTrade.securities).slice(-10); // papel/ação
        out += this.forceNumberSize(exportTrade.price); // preço
        exportTrade._sortKey = out.toUpperCase();

        return exportTrade._sortKey;
    }

    private forceNumberSize(val: number | string): string {
        val = val.toString().replace(this.notNumberRegex, '');
        return ('0000000000' + val).slice(-10);
    }

}
