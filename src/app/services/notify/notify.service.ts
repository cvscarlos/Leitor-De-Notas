import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

type NotifyCallback = (result: SweetAlertResult) => void;

@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    private queue: Array<{ options: SweetAlertOptions; callback: null | NotifyCallback }> = [];

    constructor(
    ) { }

    public success(title: string, messageOrCallback: null | string | NotifyCallback = null, callback: null | NotifyCallback = null): void {
        this.addToQueue('success', title, messageOrCallback, callback);
    }

    public error(title: string, messageOrCallback: null | string | NotifyCallback = null, callback: null | NotifyCallback = null): void {
        this.addToQueue('error', title, messageOrCallback, callback);
    }

    public info(title: string, messageOrCallback: null | string | NotifyCallback = null, callback: null | NotifyCallback = null): void {
        this.addToQueue('info', title, messageOrCallback, callback);
    }

    public warning(title: string, messageOrCallback: null | string | NotifyCallback = null, callback: null | NotifyCallback = null): void {
        this.addToQueue('warning', title, messageOrCallback, callback);
    }

    public notify(options: SweetAlertOptions, callback: null | NotifyCallback = null): void {
        this.queue.push({
            options,
            callback: typeof callback == 'function' ? callback : null
        });

        this.triggerQueue();
    }

    private addToQueue(
        type: SweetAlertIcon,
        title: string,
        messageOrCallback: null | string | NotifyCallback = null,
        callback: null | NotifyCallback = null
    ): void {
        this.queue.push({
            options: {
                icon: type,
                title,
                html: typeof messageOrCallback == 'string' ? messageOrCallback : ''
            },
            callback: typeof messageOrCallback == 'function' ? messageOrCallback : callback
        });

        this.triggerQueue();
    }

    private triggerQueue(): void {
        if (!this.queue.length || Swal.isVisible()) {
            return;
        }

        const queueItem = this.queue.shift();
        if (!queueItem) {
            return;
        }

        const options = queueItem.options;
        options.didClose = () => {
            this.triggerQueue();
        };

        Swal.fire(options).then(result => {
            if (queueItem.callback) {
                queueItem.callback(result);
            }
        });
    }
}
