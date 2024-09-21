import { Injectable } from '@angular/core';

type NumberValue = number | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {

  public br(numberValue: NumberValue, decimal = 2, minDecimal?: number): string {
    if (numberValue == null || numberValue === undefined) {
      return '';
    }

    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: minDecimal === undefined ? decimal : minDecimal,
      maximumFractionDigits: decimal,
    }).format(numberValue);
  }

  public brNoDecimal(numberValue: NumberValue): string {
    return this.br(numberValue, 0);
  }

  public commaOnly(numberValue: NumberValue, decimal = 2, minDecimal?: number) {
    return this.br(numberValue, decimal, minDecimal).replace(/\./g, '');
  }
}
