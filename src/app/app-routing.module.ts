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
import { FullPageLoadingComponent } from './full-page-loading/full-page-loading.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { RedirectComponent } from './redirect/redirect.component';
import { AdminComponent } from './admin/admin.component';

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
  { path: 'extratos', component: HomeComponent },
  { path: 'index.html', component: HomeComponent },
  {
    path: 'lnadmin',
    component: AdminComponent,
    canActivate: [AuthService, IsIframeService],
    data: { hideAboutUs: true },
  },
  { path: 'sobre', component: AboutUsComponent, data: { hideAboutUs: true } },
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
  {
    path: 'privacidade-termos',
    component: PrivacyComponent,
    canActivate: [IsIframeService],
    data: { hideAboutUs: true },
  },
  {
    path: 'limites-uso',
    component: UsageLimitComponent,
    canActivate: [IsIframeService],
    data: { hideAboutUs: true },
  },
  { path: 'oauth', component: OauthComponent, data: { hideAboutUs: true } },
  { path: 'oauth.html', component: OauthComponent, data: { hideAboutUs: true } },
  { path: 'oauth-i.html', component: OauthComponent, data: { hideAboutUs: true } },
  { path: 'binance', component: BinanceComponent, canActivate: [AuthService] },
  { path: 'loading', component: FullPageLoadingComponent, data: { hideAboutUs: true } },
  {
    path: 'faq',
    component: RedirectComponent,
    data: { externalUrl: 'https://leitor-de-notas.gitbook.io/faq/', hideAboutUs: true },
  },
  {
    path: 'suporte',
    component: RedirectComponent,
    data: { externalUrl: 'https://dlpinvest.com.br/contato', hideAboutUs: true },
  },
  {
    path: 'suporte.html',
    component: RedirectComponent,
    data: { externalUrl: 'https://dlpinvest.com.br/contato', hideAboutUs: true },
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, IsIframeService],
})
export class AppRoutingModule {}
