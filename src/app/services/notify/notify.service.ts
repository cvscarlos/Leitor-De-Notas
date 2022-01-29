import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

type NotifyCallback = (result: SweetAlertResult) => void;

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private queue: { options: SweetAlertOptions; callback: NotifyCallback }[] = [];

  constructor() { }

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

  public notify(options: SweetAlertOptions) {
    const prom = new Promise<SweetAlertResult>((callback) => this.queue.push({
      options,
      callback
    }));

    this.triggerQueue();
    return prom;
  }

  private addToQueue(
    type: SweetAlertIcon,
    title: string,
    message?: string,
  ) {
    const prom = new Promise<SweetAlertResult>((callback) => this.queue.push({
      options: {
        icon: type,
        title,
        html: message || ''
      },
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

    Swal.fire(options).then(result => {
      if (queueItem.callback) queueItem.callback(result);
    });
  }
}
