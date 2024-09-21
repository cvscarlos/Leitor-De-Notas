import { faBug, faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Component } from '@angular/core';
import { IsIframeService } from './services/is-iframe/is-iframe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public faQuestionCircle = faQuestionCircle;
  public faInfoCircle = faInfoCircle;
  public faBug = faBug;
  public headerMenuCollapsed = true;

  constructor(public isIframe: IsIframeService) {}

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
