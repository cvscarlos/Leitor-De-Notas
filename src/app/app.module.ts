import { NgModule } from '@angular/core';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideMicroSentry } from '@micro-sentry/angular';

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
import { environment } from '../environments/environment';

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
  ],
  providers: [
    provideEnvironmentNgxMask(),
    provideHttpClient(withInterceptorsFromDi()),
    provideMicroSentry({
      dsn: 'https://5b8bf0c4ebaef72d93c588958ee478ae@o4505375512395776.ingest.us.sentry.io/4508327216807936',
      environment: environment.production ? 'production' : 'development',
    }),
  ],
})
export class AppModule {}
