import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import UserDocumentComponent from './user-document.component';
import LoadingModule from 'src/app/loading/loading.module';



@NgModule({
    declarations: [UserDocumentComponent],
    imports: [
        CommonModule,
        FormsModule,
        LoadingModule,
    ],
    exports: [UserDocumentComponent]
})
export default class UserDocumentModule { }
