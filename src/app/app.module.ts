import { ErrorHandler, NgModule, provideAppInitializer, inject } from '@angular/core';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import * as Sentry from '@sentry/angular';

import { USAModalComponent } from './usa-modal/usa-modal.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { LoadingModule } from './loading/loading.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { StatisticsComponent } from './statistics/statistics.component';
import { UserAccountModule } from './user-account/user-account.module';
import { UserBarComponent } from './user-bar/user-bar.component';
import { UserEmailModule } from './user-email/user-email.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServerUnavailabilityMessageComponent } from './server-unavailability-message/server-unavailability-message.component';
import { SentryErrorHandler } from './services/sentry-error-handler.service';
import { RedirectComponent } from './redirect/redirect.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    StatisticsComponent,
    UserBarComponent,
    USAModalComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    NgbCollapseModule,
    SharedPipesModule,
    HomeModule,
    LoadingModule,
    UserAccountModule,
    UserEmailModule,
    AboutUsComponent,
    ServerUnavailabilityMessageComponent,
    RedirectComponent,
  ],
  providers: [
    provideEnvironmentNgxMask(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler,
    },
    provideAppInitializer(() => {
      inject(Sentry.TraceService);
    }),
  ],
})
export class AppModule {}
