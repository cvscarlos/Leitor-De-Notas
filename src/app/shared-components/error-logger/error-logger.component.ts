import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export interface ErrorLog {
  fileName: string;
  _messages: string[];
  _page?: string | number;
  number?: string | number;
}

@Component({
  selector: 'app-error-logger',
  templateUrl: './error-logger.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class ErrorLoggerComponent {
  @Input() errors: ErrorLog[] = [];
}
