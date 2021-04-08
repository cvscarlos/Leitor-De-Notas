import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { ManageMembersComponent } from './manage-members.component';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
    declarations: [ManageMembersComponent],
    imports: [
        CommonModule,
        FormsModule,
        LoadingModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [ManageMembersComponent]
})
export class ManageMembersModule { }
