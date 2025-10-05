import { Directive, ElementRef, HostListener, Renderer2, inject, input } from '@angular/core';

import { BrokerageNotesService } from '../../services/brokerage-notes/brokerage-notes.service';
import { StatementService } from '../../services/statement/statement.service';

@Directive({ selector: '[appUpload]', standalone: true })
export class UploadDirective {
  private notesService = inject(BrokerageNotesService);
  private statementService = inject(StatementService);
  private renderer = inject(Renderer2);
  private hostElement = inject(ElementRef);

  uploadType = input<'notes' | 'statements'>('notes');
  broker = input<string>('');

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.overClass();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.leaveClass();
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer != null) {
      if (this.uploadType() === 'statements') {
        this.statementService.uploadFiles(evt.dataTransfer.files, this.broker());
      } else {
        this.notesService.uploadFiles(evt.dataTransfer.files);
      }
    }

    this.leaveClass();
  }

  private overClass(): void {
    this.renderer.addClass(this.hostElement.nativeElement, 'file-over');
  }

  private leaveClass(): void {
    this.renderer.removeClass(this.hostElement.nativeElement, 'file-over');
  }
}
