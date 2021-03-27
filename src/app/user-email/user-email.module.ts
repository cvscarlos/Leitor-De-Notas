import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LoadingModule } from '../loading/loading.module';
import { SharedModule } from '../shared/shared.module';
import { UserEmailComponent } from './user-email.component';



@NgModule({
    declarations: [UserEmailComponent],
    imports: [
        CommonModule,
        FormsModule,
        LoadingModule,
        SharedModule,
    ],
    exports: [UserEmailComponent]
})
export class UserEmailModule { }
