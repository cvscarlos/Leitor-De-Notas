import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

import { BrokerageNotesService } from '../../services/brokerage-notes/brokerage-notes.service';

@Directive({
  selector: '[appUpload]',
  standalone: false,
})
export class UploadDirective {
  private notesService = inject(BrokerageNotesService);
  private renderer = inject(Renderer2);
  private hostElement = inject(ElementRef);

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
      this.notesService.uploadFiles(evt.dataTransfer.files);
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
