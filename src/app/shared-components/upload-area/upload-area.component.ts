import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadDirective } from '../../home/upload/upload.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.less'],
  imports: [NgIf, NgFor, FormsModule, UploadDirective, FaIconComponent],
})
export class UploadAreaComponent {
  sessionService = inject(SessionService);

  @Input() uploadType: 'notes' | 'statements' = 'notes';
  @Input() selectedBroker = '';
  @Input() uploads: any[] = [];
  @Input() hasFiles = false;
  @Input() hasErrors = false;
  @Input() errorMessages: string[] = [];
  @Input() isInvalid = false;

  @Output() onBrokerChange = new EventEmitter<string>();
  @Output() onFileInput = new EventEmitter<Event>();

  get backgroundColor() {
    return this.uploadType === 'statements' ? '#a146f4' : undefined;
  }

  get fileIcon() {
    return this.uploadType === 'statements' ? faFileCsv : faFilePdf;
  }

  get ariaLabel() {
    return this.uploadType === 'statements'
      ? 'Selecionar arquivos de extrato'
      : 'Selecionar arquivos de nota';
  }

  get inputId() {
    return this.uploadType === 'statements' ? 'statementupload' : 'fileupload';
  }

  get inputName() {
    return this.uploadType === 'statements' ? 'statement' : 'brokerageNote';
  }

  get showBrokerSelect() {
    return this.uploadType === 'statements';
  }
}
