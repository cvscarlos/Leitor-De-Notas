import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpj',
})
export class CpfCnpjPipe implements PipeTransform {
  private cpfRegex = /([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/;
  private cnpjRegex = /([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})/;
  private notNumberRegex = /[^0-9]+/g;

  transform(value: string | unknown): string {
    const valueStr = String(value || '').trim();
    const docOnlyNumbers = valueStr.replace(this.notNumberRegex, '');

    if (!docOnlyNumbers.length) return valueStr;

    const docFixedLength =
      docOnlyNumbers.length > 11
        ? docOnlyNumbers.padStart(14, '0')
        : docOnlyNumbers.padStart(11, '0');

    const docFormatted =
      docFixedLength.length === 11
        ? docFixedLength.replace(this.cpfRegex, '$1.$2.$3-$4')
        : docFixedLength.replace(this.cnpjRegex, '$1.$2.$3/$4-$5');

    return docFormatted === '00.000.000/0001-91' ? '---' : docFormatted;
  }
}
