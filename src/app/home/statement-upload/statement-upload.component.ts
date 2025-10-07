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
  public selectedBroker: string = 'Avenue';

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

  public getErrorMessages(): string[] {
    if (!this.uploads) return [];
    return this.uploads
      .filter((upload) => upload.serverError)
      .map((upload) => this.getErrorMessage(upload));
  }
}
