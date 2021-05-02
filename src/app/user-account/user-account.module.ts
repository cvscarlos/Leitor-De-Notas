import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../directives/directives.module';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { UserAccountComponent } from './user-account.component';



@NgModule({
    declarations: [UserAccountComponent],
    imports: [
        AppRoutingModule,
        CommonModule,
        DirectivesModule,
        FormsModule,
        LoadingModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [UserAccountComponent]
})
export class UserAccountModule { }
