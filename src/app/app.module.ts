import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { LoadingModule } from './loading/loading.module';
import { ManageMembersModule } from './manage-members/manage-members.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyModule } from './privacy/privacy.module';
import { ServerUnavailabilityMessageModule } from './server-unavailability-message/server-unavailability-message.module';
import { StatisticsComponent } from './statistics/statistics.component';
import { UserAccountModule } from './user-account/user-account.module';
import { UserBarComponent } from './user-bar/user-bar.component';
import { UserEmailModule } from './user-email/user-email.module';
import { UsageLimitModule } from './usage-limit/usage-limit.module';
import { AvenueModalComponent } from './avenue-modal/avenue-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    StatisticsComponent,
    UserBarComponent,
    AvenueModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CollapseModule.forRoot(),
    HttpClientModule,
    ModalModule.forRoot(),
    SharedPipesModule,
    FontAwesomeModule,

    HomeModule,
    LoadingModule,
    ManageMembersModule,
    PrivacyModule,
    ServerUnavailabilityMessageModule,
    UserAccountModule,
    UserEmailModule,
    UsageLimitModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }
