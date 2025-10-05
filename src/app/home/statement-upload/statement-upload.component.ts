import { Component, OnInit, inject } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { StatementService } from 'src/app/services/statement/statement.service';
import { StatementUploadInterface } from 'src/app/services/statement/statement-upload.interface';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadDirective } from '../upload/upload.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-statement-upload',
  templateUrl: './statement-upload.component.html',
  styleUrls: ['./statement-upload.component.less'],
  imports: [NgIf, NgFor, FormsModule, UploadDirective, FaIconComponent],
})
export class StatementUploadComponent implements OnInit {
  sessionService = inject(SessionService);
  private statementService = inject(StatementService);

  public uploads?: StatementUploadInterface[];
  public selectedBroker: string = 'Avenue';
  public faFileCsv = faFileCsv;

  constructor() {}

  ngOnInit(): void {
    this.uploads = this.statementService.getStatements().statementsList;
  }

  public hasStatements(): boolean {
    return !!this.statementService.getStatements().statementsList.length;
  }

  public handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files as FileList;
    this.statementService.uploadFiles(files, this.selectedBroker);

    input.value = '';
  }

  public hasServerErrors(): boolean {
    return Boolean(this.uploads && this.uploads.some((upload) => upload.serverError));
  }

  public getErrorMessage(upload: StatementUploadInterface): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (upload.error as any).error?._message || 'Erro desconhecido';
  }
}
