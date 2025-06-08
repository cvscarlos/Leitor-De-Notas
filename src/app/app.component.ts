import {
  faEnvelope,
  faCalculator,
  faQuestionCircle,
  faCircleDollarToSlot,
} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { IsIframeService } from './services/is-iframe/is-iframe.service';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public faQuestionCircle = faQuestionCircle;
  public faEnvelope = faEnvelope;
  public faCalculator = faCalculator;
  public faDollarSign = faCircleDollarToSlot;

  public headerMenuCollapsed = true;
  public showAboutUs = true;

  constructor(
    public isIframe: IsIframeService,
    private router: Router,
    private route: ActivatedRoute,
    trace: Sentry.TraceService, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }
      currentRoute.data.subscribe((data) => {
        this.showAboutUs = this.isIframe.isIframe() || data.hideAboutUs ? false : true;
      });
    });
  }

  onActivate() {
    const routerTags = document.getElementsByTagName(
      'router-outlet',
    ) as HTMLCollectionOf<HTMLElement>;
    if (routerTags.length) {
      window.scroll(0, Math.max(routerTags[0].offsetTop - 110, 0));
    } else {
      window.scroll(0, 0);
    }
  }
}
