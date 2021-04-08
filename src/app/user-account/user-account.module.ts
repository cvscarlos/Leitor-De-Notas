import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared/shared.module';
import { UserAccountComponent } from './user-account.component';



@NgModule({
    declarations: [UserAccountComponent],
    imports: [
        AppRoutingModule,
        CommonModule,
        FormsModule,
        LoadingModule,
        NgxMaskModule.forRoot(),
        SharedModule,
    ],
    exports: [UserAccountComponent]
})
export class UserAccountModule { }
