/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UploadInterface {
  filename: string;
  responseComplete: boolean;
  serverError: boolean;
  noteDetails: any[];
  error: any;
  server: unknown;
}
