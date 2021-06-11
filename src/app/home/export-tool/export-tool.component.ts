import { Component, OnInit } from '@angular/core';
import NP from 'number-precision';
import { ApiService } from 'src/app/services/api/api.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

import { BrokerageNotesService } from '../../services/brokerage-notes/brokerage-notes.service';
import { GenericObject } from '../../services/generic-object.interface';
import { NumberFormatService } from '../../services/number-format/number-format.service';



@Component({
    selector: 'app-export-tool',
    templateUrl: './export-tool.component.html',
    styleUrls: ['./export-tool.component.less']
})
export class ExportToolComponent implements OnInit {
    public dlombelloExportString = '';
    public excelExportString = '';
    public enableExport = false;
    public provisionedIrrfDT = false;
    public provisionedIrrfST = false;
    private dlombelloExport: GenericObject[] = [];
    private notNumberRegex = /[^0-9]+/g;
    private provIrrfMsg = false;

    constructor(
        private notesService: BrokerageNotesService,
        private numberFormatService: NumberFormatService,
        private notifyService: NotifyService,
        private apiService: ApiService,
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

        this.apiService.userMe().then((data) => {
            this.provisionedIrrfDT = !!data.settings?.provisionedIrrfDT;
            this.provisionedIrrfST = !!data.settings?.provisionedIrrfST;
        });
    }

    public copyFn(textarea: HTMLTextAreaElement): void {
        textarea.select();
        document.execCommand('copy', false);
    }

    public cleanNotes(): void {
        this.notesService.clean();
        this.dlombelloExport = [];
        this.dlombelloExportString = '';
    }

    public provisionedIRRF({ dayTrade, swingTrade }: { [x: string]: Event }): void {
        if (dayTrade) {
            this.provisionedIrrfDT = !!(dayTrade.target as HTMLInputElement)?.checked;
            this.provisionedIrrfMsg(this.provisionedIrrfDT);
        }
        else if (swingTrade) {
            this.provisionedIrrfST = !!(swingTrade.target as HTMLInputElement)?.checked;
            this.provisionedIrrfMsg(this.provisionedIrrfST);
        }

        if (dayTrade || swingTrade) {
            this.apiService.userSettings({ provisionedIrrfST: this.provisionedIrrfST, provisionedIrrfDT: this.provisionedIrrfDT });
        }
    }

    private provisionedIrrfMsg(enabled: boolean): void {
        if (enabled && !this.provIrrfMsg) {
            this.notifyService.warning('Atenção', 'Utilize esta opção com cuidado.<br/><br/>Entenda melhor como funciona <a href="https://leitordenotas.customerly.help/leitura-de-notas/irrf-provisionado" target="_blank">clicando aqui</a>.');
            this.provIrrfMsg = true;
        }
    }

    private excelParser(note: GenericObject): void {
        const excelTrades = [...note.trades];

        // Colocando dos dados da nota no primeiro item negociado
        Object.assign(
            excelTrades[0],
            note,
            { trades: null, fullText: null, IR: (note.IRRF < 0 ? note.IRRF : '') } // eslint-disable-line @typescript-eslint/naming-convention
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
                note.brokerName,
                note.number,
                note.date,
                this.numberFormatService.br(excelTrade.allFees),
                this.numberFormatService.br(excelTrade.ISSTax),
                this.numberFormatService.br(excelTrade.IRRF),
                this.numberFormatService.br(excelTrade.irrfDtProvisioned),
                this.numberFormatService.br(excelTrade.irrfStProvisioned),
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
                'Taxas',
                'ISS',
                'IRRF',
                'IRRF provisionado DT',
                'IRRF provisionado ST',
            ].join('\t');
        }

        this.excelExportString += '\n' + excelStrings.join('\n');
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
                brokerage: note.brokerName,
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
        let irrf = note.IRRF < 0 ? note.IRRF * -1 : 0;
        if (this.provisionedIrrfDT) { irrf += -note.irrfDtProvisioned; }
        if (this.provisionedIrrfST) { irrf += -note.irrfStProvisioned; }
        groupedTrades[tgFirst].IR = irrf || null;

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
