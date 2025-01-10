// Importing SweetAlert2 should be simple,
// but Angular says that it is not a ESM module.
// So, I had to force import the ESM version and cast it to the correct type.
import type * as SwalType from 'sweetalert2';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sweetalert2 from 'sweetalert2/dist/sweetalert2.esm.all.js';
const Swal = sweetalert2 as typeof SwalType.default;

import { Injectable } from '@angular/core';

type NotifyCallback = (result: SwalType.SweetAlertResult) => void;

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private queue: { options: SwalType.SweetAlertOptions; callback: NotifyCallback }[] = [];

  public success(title: string, message?: string) {
    return this.addToQueue('success', title, message);
  }

  public error(title: string, message?: string) {
    return this.addToQueue('error', title, message);
  }

  public info(title: string, message?: string) {
    return this.addToQueue('info', title, message);
  }

  public infoForceOpened(title: string, message?: string) {
    return this.addToQueue('info', title, message, {
      backdrop: 'rgba(0,0,123,0.4)',
      showConfirmButton: false,
    });
  }

  public warning(title: string, message?: string) {
    return this.addToQueue('warning', title, message);
  }

  public confirm(
    title: string,
    message?: string,
    confirmButtonText?: string,
    extendsOptions?: SwalType.SweetAlertOptions,
  ) {
    return this.notify({
      title,
      html: message || '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmButtonText || 'Sim',
      cancelButtonText: confirmButtonText ? 'Cancelar' : 'Não',
      ...extendsOptions,
    });
  }

  private addToQueue(
    type: SwalType.SweetAlertIcon,
    title: string,
    message?: string,
    options = {},
  ): Promise<SwalType.SweetAlertResult> {
    return this.notify({
      icon: type,
      title,
      html: message || '',
      ...options,
    });
  }

  private notify(options: SwalType.SweetAlertOptions): Promise<SwalType.SweetAlertResult> {
    const prom = new Promise<SwalType.SweetAlertResult>((callback) =>
      this.queue.push({
        options,
        callback,
      }),
    );

    this.triggerQueue();
    return prom;
  }

  private triggerQueue(): void {
    if (!this.queue.length || Swal.isVisible()) return;

    const queueItem = this.queue.shift();
    if (!queueItem) return;

    const options = queueItem.options;
    options.didClose = () => this.triggerQueue();

    Swal.fire(options).then((r) => queueItem.callback(r));
  }
}
