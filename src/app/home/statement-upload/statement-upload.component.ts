import { Component, OnInit, inject } from '@angular/core';
import { StatementService } from 'src/app/services/statement/statement.service';
import { StatementUploadInterface } from 'src/app/services/statement/statement-upload.interface';
import { UploadAreaComponent } from '../../shared-components/upload-area/upload-area.component';

@Component({
  selector: 'app-statement-upload',
  templateUrl: './statement-upload.component.html',
  styleUrls: ['./statement-upload.component.less'],
  imports: [UploadAreaComponent],
})
export class StatementUploadComponent implements OnInit {
  private statementService = inject(StatementService);

  public uploads?: StatementUploadInterface[];
  public selectedBroker = '';
  public brokerSelectIsInvalid = false;
  private pendingFiles: FileList | null = null;
  private fileInput: HTMLInputElement | null = null;

  ngOnInit(): void {
    this.uploads = this.statementService.getStatements().statementsList;
  }

  public hasStatements(): boolean {
    return !!this.statementService.getStatements().statementsList.length;
  }

  public handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileInput = input;
    this.pendingFiles = input.files && input.files.length > 0 ? input.files : null;
    this.attemptUpload();
  }

  public onBrokerChange(broker: string): void {
    this.selectedBroker = broker;
    this.attemptUpload();
  }

  private attemptUpload(): void {
    const brokerIsSelected = !!this.selectedBroker;
    const filesAreSelected = !!this.pendingFiles;

    this.brokerSelectIsInvalid = filesAreSelected && !brokerIsSelected;

    if (brokerIsSelected && filesAreSelected) {
      this.statementService.uploadFiles(this.pendingFiles!, this.selectedBroker);

      this.pendingFiles = null;
      if (this.fileInput) {
        this.fileInput.value = '';
        this.fileInput = null;
      }
    }
  }

  public hasServerErrors(): boolean {
    return Boolean(this.uploads && this.uploads.some((upload) => upload.serverError));
  }

  public getErrorMessage(upload: StatementUploadInterface): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (upload.error as any).error?._message || 'Erro desconhecido';
  }

  public getErrorMessages(): string[] {
    if (!this.uploads) return [];
    return this.uploads
      .filter((upload) => upload.serverError)
      .map((upload) => this.getErrorMessage(upload));
  }
}
