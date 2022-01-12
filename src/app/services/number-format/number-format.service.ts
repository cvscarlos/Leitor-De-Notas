import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormatService {

  constructor() { }

  public br(numberValue: number, decimal = 2, minDecimal?: number): string {
    if (numberValue == null) {
      return '';
    }

    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: minDecimal === undefined ? decimal : minDecimal,
      maximumFractionDigits: decimal
    }).format(numberValue);
  }

  public brNoDecimal(numberValue: number): string {
    return this.br(numberValue, 0);
  }

  public commaOnly(numberValue: number, decimal = 2, minDecimal?: number) {
    return this.br(numberValue, decimal, minDecimal).replace(/\./g, '');
  }
}
