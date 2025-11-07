import { Component, Input } from '@angular/core';

export interface ErrorLog {
  fileName: string;
  _messages: string[];
  _page?: string | number;
  number?: string | number;
}

@Component({
  selector: 'app-error-logger',
  templateUrl: './error-logger.component.html',
  imports: [],
})
export class ErrorLoggerComponent {
  @Input() errors: ErrorLog[] = [];
}
