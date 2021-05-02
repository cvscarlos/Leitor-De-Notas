import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LoadingModule } from '../loading/loading.module';
import { UserEmailComponent } from './user-email.component';
import { DirectivesModule } from '../directives/directives.module';



@NgModule({
    declarations: [
        UserEmailComponent,
    ],
    imports: [
        DirectivesModule,
        CommonModule,
        FormsModule,
        LoadingModule,
    ],
    exports: [UserEmailComponent]
})
export class UserEmailModule { }
