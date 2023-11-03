import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { BinanceComponent } from './binance/binance.component';
import { HomeComponent } from './home/home.component';
import { IsIframeService } from './services/is-iframe/is-iframe.service';
import { ManageMembersComponent } from './manage-members/manage-members.component';
import { NgModule } from '@angular/core';
import { OauthComponent } from './oauth/oauth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { UsageLimitComponent } from './usage-limit/usage-limit.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserEmailComponent } from './user-email/user-email.component';

const queryMatcher = (queryToMatch: string): boolean => {
  const url = new URL(window.location.href);
  return url.search.includes(queryToMatch);
};

const routes: Routes = [
  {
    redirectTo: 'privacidade-termos',
    matcher: (url: UrlSegment[]) => (queryMatcher('privacidade-termos') ? { consumed: url } : null),
  },
  {
    redirectTo: 'limites-uso',
    matcher: (url: UrlSegment[]) => (queryMatcher('limites-uso') ? { consumed: url } : null),
  },

  { path: '', component: HomeComponent },
  { path: 'index.html', component: HomeComponent },
  {
    path: 'minha-conta',
    component: UserAccountComponent,
    canActivate: [AuthService, IsIframeService],
  },
  {
    path: 'editar-email',
    component: UserEmailComponent,
    canActivate: [AuthService, IsIframeService],
  },
  {
    path: 'gerenciar-membros',
    component: ManageMembersComponent,
    canActivate: [AuthService, IsIframeService],
  },
  { path: 'privacidade-termos', component: PrivacyComponent, canActivate: [IsIframeService] },
  { path: 'limites-uso', component: UsageLimitComponent, canActivate: [IsIframeService] },
  { path: 'oauth.html', component: OauthComponent },
  { path: 'oauth-i.html', component: OauthComponent },
  { path: 'binance', component: BinanceComponent, canActivate: [AuthService] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, IsIframeService],
})
export class AppRoutingModule {}
