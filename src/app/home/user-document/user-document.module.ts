import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from 'src/app/loading/loading.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { UserDocumentComponent } from './user-document.component';



@NgModule({
  declarations: [UserDocumentComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoadingModule,
    NgxMaskModule.forRoot(),
    ModalModule.forRoot(),
  ],
  exports: [UserDocumentComponent],
})
export class UserDocumentModule { }
