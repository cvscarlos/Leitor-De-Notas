import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import AuthComponent from './auth.component';
import SharedModule from '../shared/shared.module';
import LoadingModule from '../loading/loading.module';



@NgModule({
    declarations: [AuthComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        LoadingModule,
    ],
    exports: [AuthComponent]
})
export default class AuthModule { }
