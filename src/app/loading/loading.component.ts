import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.less'],
    imports: [NgIf],
})
export class LoadingComponent {
  @Input() show = false;
}
