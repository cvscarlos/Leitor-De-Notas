import {
  faEnvelope,
  faCalculator,
  faQuestionCircle,
  faCircleDollarToSlot,
} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { IsIframeService } from './services/is-iframe/is-iframe.service';
import { IframeHeightService } from './services/iframe-height/iframe-height.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = inject(IsIframeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private iframeHeightService = inject(IframeHeightService);

  public faQuestionCircle = faQuestionCircle;
  public faEnvelope = faEnvelope;
  public faCalculator = faCalculator;
  public faDollarSign = faCircleDollarToSlot;

  public headerMenuCollapsed = true;
  public showAboutUs = true;

  constructor() {}

  ngOnInit(): void {
    this.iframeHeightService.initialize();

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

  ngOnDestroy(): void {
    this.iframeHeightService.destroy();
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
