import { Component, OnInit } from '@angular/core';
import packageJson from '../../../package.json';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent implements OnInit {

  public appVersion?: string;
  public interfaceVersion?: string;
  public uniqueSessions?: string;

  constructor(
        private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.interfaceVersion = packageJson.version;

    this.apiService.getServerStatus(data => {
      this.appVersion = data.version;
      this.uniqueSessions = data.uniqueSessions;
    });
  }

}
