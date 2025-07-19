import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import packageJson from '../package.json';

if (environment.production) {
  enableProdMode();
}

Sentry.init({
  dsn: 'https://5b8bf0c4ebaef72d93c588958ee478ae@o4505375512395776.ingest.us.sentry.io/4508327216807936',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  environment: environment.production ? 'production' : 'development',
  release: `${packageJson.name}@${packageJson.version}`,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    'localhost',
    'https://api-5.leitordenotas.com.br',
    'https://api-upload.leitordenotas.com.br',
  ],
  // Session Replay
  replaysSessionSampleRate: 0.2, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  _experiments: {
    enableLogs: true,
  },
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
