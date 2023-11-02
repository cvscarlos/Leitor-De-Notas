export interface UploadInterface {
  filename: string;
  responseComplete: boolean;
  serverError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  noteDetails: any[];
  error: unknown;
  server: unknown;
}
