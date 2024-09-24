import { USAModalComponent } from './usa-modal/usa-modal.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeModule } from './home/home.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingModule } from './loading/loading.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { StatisticsComponent } from './statistics/statistics.component';
import { UserAccountModule } from './user-account/user-account.module';
import { UserBarComponent } from './user-bar/user-bar.component';
import { UserEmailModule } from './user-email/user-email.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServerUnavailabilityMessageComponent } from './server-unavailability-message/server-unavailability-message.component';

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
  providers: [provideEnvironmentNgxMask(), provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
