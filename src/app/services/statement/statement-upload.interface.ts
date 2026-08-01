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

/** Renda fixa e fundos: um item por compra, sem agregação. */
export interface StatementPosition {
  asset: string;
  cnpj: string;
  name: string;
  sourceType: string;
  date: string;
  quantity: number;
  price: number;
  value: number;
  index: string;
  indexPercent: number;
  additionalRate: number;
}

export interface StatementBatch {
  details: StatementDetail[];
  positions: StatementPosition[];
  broker: string;
  fileName: string;
}

export interface StatementResponse {
  result: StatementDetail[];
  positions?: StatementPosition[];
  errors?: string[];
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
