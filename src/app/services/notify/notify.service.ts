import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

type NotifyCallback = (result: SweetAlertResult) => void;

@Injectable({
  providedIn: 'root',
})
export class NotifyService {

  private queue: { options: SweetAlertOptions; callback: NotifyCallback }[] = [];

  public success(title: string, message?: string) {
    return this.addToQueue('success', title, message);
  }

  public error(title: string, message?: string) {
    return this.addToQueue('error', title, message);
  }

  public info(title: string, message?: string) {
    return this.addToQueue('info', title, message);
  }

  public warning(title: string, message?: string) {
    return this.addToQueue('warning', title, message);
  }

  public confirm(title: string, message?: string, confirmButtonText?: string) {
    return this.notify({
      title,
      html: message || '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmButtonText || 'Sim',
      cancelButtonText: confirmButtonText ? 'Cancelar' : 'Não',
    });
  }

  private addToQueue(type: SweetAlertIcon, title: string, message?: string): Promise<SweetAlertResult> {
    return this.notify({
      icon: type,
      title,
      html: message || '',
    });
  }

  private notify(options: SweetAlertOptions) {
    const prom = new Promise<SweetAlertResult>((callback) => this.queue.push({
      options,
      callback,
    }));

    this.triggerQueue();
    return prom;
  }

  private triggerQueue(): void {
    if (!this.queue.length || Swal.isVisible()) return;

    const queueItem = this.queue.shift();
    if (!queueItem) return;

    const options = queueItem.options;
    options.didClose = () => this.triggerQueue();

    Swal.fire(options).then(r => queueItem.callback(r));
  }
}
