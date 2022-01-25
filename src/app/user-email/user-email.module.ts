import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LoadingModule } from '../loading/loading.module';
import { UserEmailComponent } from './user-email.component';
import { SharedDirectivesModule } from '../shared-directives/shared-directives.module';



@NgModule({
  declarations: [
    UserEmailComponent,
  ],
  imports: [
    SharedDirectivesModule,
    CommonModule,
    FormsModule,
    LoadingModule,
  ],
  exports: [UserEmailComponent]
})
export class UserEmailModule { }
