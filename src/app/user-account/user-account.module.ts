import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from '../app-routing.module';
import { LoadingModule } from '../loading/loading.module';
import { SharedDirectivesModule } from '../shared-directives/shared-directives.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { UserAccountComponent } from './user-account.component';



@NgModule({
    declarations: [UserAccountComponent],
    imports: [
        AppRoutingModule,
        CommonModule,
        SharedDirectivesModule,
        FormsModule,
        LoadingModule,
        NgxMaskModule.forRoot(),
        SharedPipesModule,
    ],
    exports: [UserAccountComponent]
})
export class UserAccountModule { }
