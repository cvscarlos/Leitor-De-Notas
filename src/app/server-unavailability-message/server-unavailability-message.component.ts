import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../services/api/api.service';

import { SharedDirectivesModule } from '../shared-directives/shared-directives.module';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

@Component({
  selector: 'app-server-unavailability-message',
  imports: [SharedDirectivesModule],
  templateUrl: './server-unavailability-message.component.html',
  styleUrls: ['./server-unavailability-message.component.less'],
})
export class ServerUnavailabilityMessageComponent implements OnInit {
  apiService = inject(ApiService);

  public serverStatus = 0;

  constructor() {}

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
      ga_category: params[0],
      ga_action: params[1],
      ga_label: params[2],
    });
  }
}
