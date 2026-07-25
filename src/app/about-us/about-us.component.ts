import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { IsIframeService } from '../services/is-iframe/is-iframe.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about-us.component.less',
})
export class AboutUsComponent {
  public isIframe = inject(IsIframeService);
}
