import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import LoadingModule from '../loading/loading.module';
import ManageMembersComponent from './manage-members.component';



@NgModule({
    declarations: [ManageMembersComponent],
    imports: [
        CommonModule,
        FormsModule,
        LoadingModule,
    ],
    exports: [ManageMembersComponent]
})
export default class ManageMembersModule { }
