import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FileNamePartPipe } from 'src/app/shared-pipes/file-name/file-name-part.pipe';

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
  imports: [FileNamePartPipe],
})
export class ErrorLoggerComponent {
  @Input() errors: ErrorLog[] = [];
}
