import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

import { BrokerageNotesService } from '../../services/brokerage-notes/brokerage-notes.service';

@Directive({
  selector: '[appUpload]',
})
export class UploadDirective {

  constructor(
    private notesService: BrokerageNotesService,
    private renderer: Renderer2,
    private hostElement: ElementRef,
  ) { }

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
