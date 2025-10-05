import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { StatementUploadInterface, StatementDetail, StatementError } from './statement-upload.interface';

type StatementsArray = {
  statementsList: StatementUploadInterface[];
  statementDetails: StatementDetail[];
  statementErrors: StatementError[];
};
type StatementCallback = (statement: StatementDetail[]) => void;

@Injectable({
  providedIn: 'root',
})
export class StatementService {
  private api = inject(ApiService);

  private statementsList: StatementUploadInterface[] = [];
  private statementDetails: StatementDetail[] = [];
  private statementErrors: StatementError[] = [];
  private onNewStatementCallback: StatementCallback[] = [];

  constructor() {}

  public uploadFiles(files: FileList | null, broker: string): void {
    if (!files || !broker) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      this.upload(files[i], broker);
    }
  }

  public getStatements(): StatementsArray {
    return {
      statementsList: this.statementsList,
      statementDetails: this.statementDetails,
      statementErrors: this.statementErrors,
    };
  }

  public statementCallback(onNewStatementCallback: StatementCallback): void {
    this.onNewStatementCallback.push(onNewStatementCallback);
  }

  public clean(): void {
    this.statementsList.splice(0, this.statementsList.length);
    this.statementDetails.splice(0, this.statementDetails.length);
    this.statementErrors.splice(0, this.statementErrors.length);
  }

  private upload(file: File, broker: string): void {
    const newFile: StatementUploadInterface = {
      filename: file.name,
      responseComplete: false,
      serverError: false,
      statementDetails: [],
      error: {},
      server: {},
    };
    this.statementsList.push(newFile);

    const formData = new FormData();
    formData.append('statement', file, file.name);
    formData.append('broker', broker);

    this.api
      .uploadStatement(formData)
      .then((res) => {
        const content = res.data || res;
        newFile.server = content;
        this.parseDetails(content, file.name);
      })
      .catch((err) => {
        newFile.serverError = true;
        newFile.error = err;
      })
      .finally(() => {
        newFile.responseComplete = true;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseDetails(serverResponse: any, fileName: string): void {
    const result = serverResponse.result || {};
    const details: StatementDetail[] = [];

    for (const key in result) {
      if (!Object.prototype.hasOwnProperty.call(result, key)) continue;

      const item = result[key];
      const detail: StatementDetail = {
        date: item.date,
        stock: item.stock,
        value: item.value,
        dlpType: item.dlpType,
      };
      details.push(detail);
      this.statementDetails.push(detail);
    }

    this.onNewStatementCallback.forEach((callback) => {
      callback(details);
    });
  }
}
