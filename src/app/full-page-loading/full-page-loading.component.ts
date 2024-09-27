import { Component } from '@angular/core';
import { LoadingModule } from '../loading/loading.module';

@Component({
  selector: 'app-full-page-loading',
  standalone: true,
  imports: [LoadingModule],
  template: `
    <div class="bg-white fixed-top h-100 w-100 z-1">
      <app-loading [show]="true"></app-loading>
    </div>
  `,
})
export class FullPageLoadingComponent {}
