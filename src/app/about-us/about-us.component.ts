import { Component, inject } from '@angular/core';
import { IsIframeService } from '../services/is-iframe/is-iframe.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-about-us',
  imports: [NgIf],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.less',
})
export class AboutUsComponent {
  public isIframe = inject(IsIframeService);
}
