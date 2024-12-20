import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less'],
  standalone: false,
})
export class LoadingComponent {
  @Input() show = false;
}
