import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './home/home.component';
import { ManageMembersComponent } from './manage-members/manage-members.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { UsageLimitComponent } from './usage-limit/usage-limit.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserEmailComponent } from './user-email/user-email.component';


const queryMatcher = (queryToMatch: string): boolean => {
    const a = document.createElement('a');
    a.href = window.location.href;
    return a.search.indexOf(queryToMatch) > -1;
};

const routes: Routes = [
    { redirectTo: 'privacidade-termos', matcher: (url: UrlSegment[]) => queryMatcher('privacidade-termos') ? { consumed: url } : null },
    { redirectTo: 'limites-uso', matcher: (url: UrlSegment[]) => queryMatcher('limites-uso') ? { consumed: url } : null },

    { path: '', component: HomeComponent },
    { path: 'index.html', component: HomeComponent },
    { path: 'minha-conta', component: UserAccountComponent, canActivate: [AuthService] },
    { path: 'editar-email', component: UserEmailComponent, canActivate: [AuthService] },
    { path: 'gerenciar-membros', component: ManageMembersComponent, canActivate: [AuthService] },
    { path: 'privacidade-termos', component: PrivacyComponent },
    { path: 'limites-uso', component: UsageLimitComponent },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthService],
})
export class AppRoutingModule { }
