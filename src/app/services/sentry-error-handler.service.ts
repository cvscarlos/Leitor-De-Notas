import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    // O ApiService já reporta as falhas HTTP (agrupadas e sem os 4xx); elas chegam aqui de
    // novo quando o subscribe de quem chamou não tem callback de erro
    if (!(error instanceof HttpErrorResponse)) Sentry.captureException(error);
    console.error('Error caught by Sentry:', error);
  }
}
