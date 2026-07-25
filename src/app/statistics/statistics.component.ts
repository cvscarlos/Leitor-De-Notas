import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import packageJson from '../../../package.json';

@Component({
  selector: 'app-statistics',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent implements OnInit {
  private apiService = inject(ApiService);

  public appVersion?: string;
  public interfaceVersion?: string;
  public uniqueSessions?: string;

  constructor() {}

  ngOnInit(): void {
    this.interfaceVersion = packageJson.version;

    this.apiService.getServerStatus((data) => {
      this.appVersion = data.version;
      this.uniqueSessions = data.uniqueSessions;
    });
  }
}
