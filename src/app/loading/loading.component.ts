import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less'],
  imports: [],
})
export class LoadingComponent {
  @Input() show = false;
}
