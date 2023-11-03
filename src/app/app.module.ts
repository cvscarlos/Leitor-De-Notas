import { ApexModalComponent } from './apex-modal/apex-modal.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from './loading/loading.module';
import { ManageMembersModule } from './manage-members/manage-members.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OauthModule } from './oauth/oauth.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyModule } from './privacy/privacy.module';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { ServerUnavailabilityMessageModule } from './server-unavailability-message/server-unavailability-message.module';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsageLimitModule } from './usage-limit/usage-limit.module';
import { UserAccountModule } from './user-account/user-account.module';
import { UserBarComponent } from './user-bar/user-bar.component';
import { UserEmailModule } from './user-email/user-email.module';
import { BinanceModule } from './binance/binance.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    StatisticsComponent,
    UserBarComponent,
    ApexModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbCollapseModule,
    SharedPipesModule,

    HomeModule,
    LoadingModule,
    ManageMembersModule,
    PrivacyModule,
    ServerUnavailabilityMessageModule,
    UserAccountModule,
    UserEmailModule,
    UsageLimitModule,
    OauthModule,
    BinanceModule,
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
