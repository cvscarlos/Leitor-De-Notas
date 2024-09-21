import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from 'src/app/loading/loading.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { UserDocumentComponent } from './user-document.component';

@NgModule({
  declarations: [UserDocumentComponent],
  imports: [CommonModule, FormsModule, LoadingModule, NgbModalModule],
  exports: [UserDocumentComponent],
})
export class UserDocumentModule {}
