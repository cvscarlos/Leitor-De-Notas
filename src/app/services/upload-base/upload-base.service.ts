interface UploadObject {
  responseComplete: boolean;
  serverError: boolean;
  server?: unknown;
  error?: unknown;
}

export abstract class UploadBaseService<
  TUpload extends UploadObject,
  TDetail,
  TError,
  TCallbackParam = TDetail,
> {
  protected uploadsList: TUpload[] = [];
  protected detailsList: TDetail[] = [];
  protected errorsList: TError[] = [];
  protected callbacks: Array<(detail: TCallbackParam) => void> = [];

  public getUploads() {
    return {
      uploadsList: this.uploadsList,
      detailsList: this.detailsList,
      errorsList: this.errorsList,
    };
  }

  public registerCallback(callback: (detail: TCallbackParam) => void): void {
    this.callbacks.push(callback);
  }

  public clean(): void {
    this.uploadsList.splice(0, this.uploadsList.length);
    this.detailsList.splice(0, this.detailsList.length);
    this.errorsList.splice(0, this.errorsList.length);
  }

  protected notifyCallbacks(detail: TCallbackParam): void {
    this.callbacks.forEach((callback) => callback(detail));
  }

  protected abstract parseResponse(serverResponse: unknown, fileName: string): void;
  protected abstract createFormData(file: File, ...args: unknown[]): FormData;
  protected abstract uploadToApi(formData: FormData): Promise<{ data?: unknown } | unknown>;

  protected uploadFile(file: File, uploadObject: TUpload, ...additionalArgs: unknown[]): void {
    this.uploadsList.push(uploadObject);

    const formData = this.createFormData(file, ...additionalArgs);

    this.uploadToApi(formData)
      .then((res) => {
        const content = (res as { data?: unknown }).data || res;
        uploadObject.server = content;
        this.parseResponse(content, file.name);
      })
      .catch((err) => {
        uploadObject.serverError = true;
        uploadObject.error = err;
      })
      .finally(() => {
        uploadObject.responseComplete = true;
      });
  }
}
