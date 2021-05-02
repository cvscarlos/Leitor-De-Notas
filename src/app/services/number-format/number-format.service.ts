import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NumberFormatService {

    constructor() { }

    public br(numberValue: number, decimal = 2): string {
        if (numberValue == null) {
            return '';
        }

        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimal,
            maximumFractionDigits: decimal
        }).format(numberValue);
    }

    public br0(numberValue: number): string {
        return this.br(numberValue, 0);
    }
}
