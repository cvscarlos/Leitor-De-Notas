import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import {
  StatementUploadInterface,
  StatementDetail,
  StatementError,
  StatementPosition,
  StatementResponse,
  StatementApiResponse,
  StatementBatch,
} from './statement-upload.interface';
import { UploadBaseService } from '../upload-base/upload-base.service';

type StatementsArray = {
  statementsList: StatementUploadInterface[];
  statementDetails: StatementDetail[];
  statementErrors: StatementError[];
  statementPositions: StatementPosition[];
};

@Injectable({
  providedIn: 'root',
})
export class StatementService extends UploadBaseService<
  StatementUploadInterface,
  StatementDetail,
  StatementError,
  StatementBatch
> {
  private api = inject(ApiService);
  private positionsList: StatementPosition[] = [];

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
      statementPositions: this.positionsList,
    };
  }

  public override clean(): void {
    super.clean();
    this.positionsList.splice(0, this.positionsList.length);
  }

  public statementCallback(callback: (batch: StatementBatch) => void): void {
    this.registerCallback(callback);
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

  protected uploadToApi(formData: FormData): Promise<unknown> {
    return this.api.uploadStatement(formData);
  }

  protected parseResponse(serverResponse: unknown, fileName: string): void {
    const apiResponse = serverResponse as StatementApiResponse;

    // Check for generic upload error
    if (apiResponse.uploadGenericError) {
      const error: StatementError = {
        fileName: apiResponse.uploadGenericError.fileName,
        _messages: apiResponse.uploadGenericError._messages,
      };
      this.errorsList.push(error);
      this.notifyCallbacks({
        details: [],
        positions: [],
        broker: '',
        fileName: apiResponse.uploadGenericError.fileName,
      });
      return;
    }

    // Handle successful response with data
    const response = apiResponse.data || (serverResponse as StatementResponse);
    const result = response.result || [];
    const details: StatementDetail[] = [];

    for (const item of result) {
      const detail: StatementDetail = {
        date: item.date,
        stock: item.stock,
        value: item.value,
        dlpType: item.dlpType,
        tax: item.tax,
        currency: item.currency,
      };
      details.push(detail);
      this.detailsList.push(detail);
    }

    const positions: StatementPosition[] = [];

    for (const item of response.positions || []) {
      const position: StatementPosition = {
        asset: item.asset,
        cnpj: item.cnpj,
        name: item.name,
        sourceType: item.sourceType,
        date: item.date,
        quantity: item.quantity,
        price: item.price,
        value: item.value,
        index: item.index,
        indexPercent: item.indexPercent,
        additionalRate: item.additionalRate,
      };
      positions.push(position);
      this.positionsList.push(position);
    }

    // Handle errors array from response
    if (response.errors && response.errors.length > 0) {
      const error: StatementError = {
        fileName: response.fileName || fileName,
        _messages: response.errors,
      };
      this.errorsList.push(error);
    }

    const batch: StatementBatch = {
      details,
      positions,
      broker: response.broker,
      fileName: response.fileName || fileName,
    };

    this.notifyCallbacks(batch);
  }
}
