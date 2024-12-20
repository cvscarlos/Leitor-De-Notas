import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import packageJson from '../../../package.json';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  standalone: false,
})
export class StatisticsComponent implements OnInit {
  public appVersion?: string;
  public interfaceVersion?: string;
  public uniqueSessions?: string;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.interfaceVersion = packageJson.version;

    this.apiService.getServerStatus((data) => {
      this.appVersion = data.version;
      this.uniqueSessions = data.uniqueSessions;
    });
  }
}
