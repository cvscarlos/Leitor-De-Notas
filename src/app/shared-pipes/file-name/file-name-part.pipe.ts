import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileNamePart', standalone: true })
export class FileNamePartPipe implements PipeTransform {
  private maxExtensionLength = 6;

  transform(value: string | unknown, part: 'name' | 'extension' = 'name'): string {
    const fileName = String(value ?? '').trim();
    const dotIndex = fileName.lastIndexOf('.');
    const hasExtension = dotIndex > 0 && fileName.length - dotIndex <= this.maxExtensionLength;

    if (part === 'extension') {
      return hasExtension ? fileName.slice(dotIndex) : '';
    }

    return hasExtension ? fileName.slice(0, dotIndex) : fileName;
  }
}
