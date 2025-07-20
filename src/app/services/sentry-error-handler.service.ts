import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    Sentry.captureException(error);
    console.error('Error caught by Sentry:', error);
  }
}
