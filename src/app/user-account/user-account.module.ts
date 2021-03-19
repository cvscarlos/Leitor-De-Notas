import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import SharedModule from '../shared/shared.module';
import UserAccountComponent from './user-account.component';
import LoadingModule from '../loading/loading.module';



@NgModule({
    declarations: [UserAccountComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        LoadingModule,
    ],
    exports: [UserAccountComponent]
})
export default class UserAccountModule { }
