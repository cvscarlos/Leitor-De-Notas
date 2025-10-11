export interface StatementUploadInterface {
  filename: string;
  responseComplete: boolean;
  serverError: boolean;
  statementDetails: StatementDetail[];
  error: Record<string, unknown>;
  server: Record<string, unknown>;
}

export interface StatementDetail {
  date: string;
  stock: string;
  value: number;
  dlpType: string;
  tax: number;
  currency: string;
}

export interface StatementBatch {
  details: StatementDetail[];
  broker: string;
  fileName: string;
}

export interface StatementResponse {
  result: StatementDetail[];
  broker: string;
  fileName: string;
}

export interface StatementApiResponse {
  data?: StatementResponse;
  uploadGenericError?: import('src/types').UploadGenericError;
}

export interface StatementError {
  _messages: string[];
  fileName: string;
}
