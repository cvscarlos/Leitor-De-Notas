import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api/api.service';

declare global {
    interface Window { dataLayer: any }
}


@Component({
    selector: 'app-server-unavailability-message',
    templateUrl: './server-unavailability-message.component.html',
    styleUrls: ['./server-unavailability-message.component.less']
})
export class ServerUnavailabilityMessageComponent implements OnInit {

    public serverStatus = 0;

    constructor(
        public apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.checkServerStatus();
    }

    private checkServerStatus() {
        const evtCat = 'Connection Status Notification';

        const msg30s = setTimeout(() => {
            this.serverStatus = 1;
            this.gaCustomEvent([evtCat, '30 seg', '']);
        }, 30 * 1000);

        const msg60s = setTimeout(() => {
            this.serverStatus = 2;
            this.gaCustomEvent([evtCat, '60 seg', '']);
        }, 60 * 1000);

        const msg90s = setTimeout(() => {
            this.serverStatus = 3;
            this.gaCustomEvent([evtCat, '90 seg', '']);
        }, 90 * 1000);

        const msg120s = setTimeout(() => {
            this.serverStatus = 4;
            this.gaCustomEvent([evtCat, '120 seg', '']);
        }, 120 * 1000);

        this.apiService.getServerStatus(() => {
            clearTimeout(msg30s);
            clearTimeout(msg60s);
            clearTimeout(msg90s);
            clearTimeout(msg120s);
        });
    }

    private gaCustomEvent(params: string[]) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'GACustomEvent',
            ga_category: params[0], // eslint-disable-line @typescript-eslint/naming-convention
            ga_action: params[1], // eslint-disable-line @typescript-eslint/naming-convention
            ga_label: params[2], // eslint-disable-line @typescript-eslint/naming-convention
        });
    }
}
