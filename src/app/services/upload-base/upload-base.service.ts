export abstract class UploadBaseService<TUpload, TDetail, TError, TCallbackParam = TDetail> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract parseResponse(serverResponse: any, fileName: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract createFormData(file: File, ...args: any[]): FormData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract uploadToApi(formData: FormData): Promise<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected uploadFile(file: File, uploadObject: TUpload, ...additionalArgs: any[]): void {
    this.uploadsList.push(uploadObject);

    const formData = this.createFormData(file, ...additionalArgs);

    this.uploadToApi(formData)
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = res.data || res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (uploadObject as any).server = content;
        this.parseResponse(content, file.name);
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (uploadObject as any).serverError = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (uploadObject as any).error = err;
      })
      .finally(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (uploadObject as any).responseComplete = true;
      });
  }
}
