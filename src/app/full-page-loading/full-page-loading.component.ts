import { Component } from '@angular/core';
import { LoadingModule } from '../loading/loading.module';

@Component({
  selector: 'app-full-page-loading',
  standalone: true,
  imports: [LoadingModule],
  template: `
    <div class="position-fixed w-100 h-100 bg-white top-0 z-1">
      <app-loading [show]="true"></app-loading>
    </div>
  `,
})
export class FullPageLoadingComponent {}
