import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import {
  StatementUploadInterface,
  StatementDetail,
  StatementError,
  StatementResponse,
  StatementApiResponse,
} from './statement-upload.interface';
import { UploadBaseService } from '../upload-base/upload-base.service';

type StatementsArray = {
  statementsList: StatementUploadInterface[];
  statementDetails: StatementDetail[];
  statementErrors: StatementError[];
};

@Injectable({
  providedIn: 'root',
})
export class StatementService extends UploadBaseService<
  StatementUploadInterface,
  StatementDetail,
  StatementError,
  StatementDetail[]
> {
  private api = inject(ApiService);
  private broker: string = '';
  private fileName: string = '';

  constructor() {
    super();
  }

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
      statementsList: this.uploadsList,
      statementDetails: this.detailsList,
      statementErrors: this.errorsList,
    };
  }

  public statementCallback(callback: (statement: StatementDetail[]) => void): void {
    this.registerCallback(callback);
  }

  public getBroker(): string {
    return this.broker;
  }

  public getFileName(): string {
    return this.fileName;
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

    this.uploadFile(file, newFile, broker);
  }

  protected createFormData(file: File, broker: string): FormData {
    const formData = new FormData();
    formData.append('statement', file, file.name);
    formData.append('broker', broker);
    return formData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected uploadToApi(formData: FormData): Promise<any> {
    return this.api.uploadStatement(formData);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseResponse(serverResponse: any, fileName: string): void {
    const apiResponse = serverResponse as StatementApiResponse;

    // Check for generic upload error
    if (apiResponse.uploadGenericError) {
      const error: StatementError = {
        fileName: apiResponse.uploadGenericError.fileName,
        _messages: apiResponse.uploadGenericError._messages,
      };
      this.errorsList.push(error);
      this.notifyCallbacks([]);
      return;
    }

    // Handle successful response with data
    const response = apiResponse.data || (serverResponse as StatementResponse);
    this.broker = response.broker || '';
    this.fileName = response.fileName || fileName;

    const result = response.result || [];
    const details: StatementDetail[] = [];

    for (const item of result) {
      const detail: StatementDetail = {
        date: item.date,
        stock: item.stock,
        value: item.value,
        dlpType: item.dlpType,
        tax: item.tax,
      };
      details.push(detail);
      this.detailsList.push(detail);
    }

    this.notifyCallbacks(details);
  }
}
