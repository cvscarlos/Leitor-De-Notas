import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpj',
})
export class CpfCnpjPipe implements PipeTransform {

  private cpfRegex = /([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/;
  private cnpjRegex = /([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})/;
  private notNumberRegex = /[^0-9]+/g;

  transform(value: string | unknown): string {
    let doc = (`${value}`).trim().replace(this.notNumberRegex, '');

    doc = doc.length > 11 ?
      doc.padStart(14, '0') :
      doc.padStart(11, '0');

    doc = doc.length === 11 ?
      doc.replace(this.cpfRegex, '$1.$2.$3-$4') :
      doc.replace(this.cnpjRegex, '$1.$2.$3/$4-$5');

    return doc === '00.000.000/0001-91' ? '---' : doc;
  }

}
