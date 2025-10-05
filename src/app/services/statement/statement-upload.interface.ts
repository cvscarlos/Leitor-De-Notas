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
}

export interface StatementError {
  _messages: string[];
  fileName: string;
}
