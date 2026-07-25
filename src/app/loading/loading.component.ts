import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class LoadingComponent {
  @Input() show = false;
}
