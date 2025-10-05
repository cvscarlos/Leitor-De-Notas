import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from 'src/app/loading/loading.module';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';
import { UserEmailComponent } from './user-email.component';

@NgModule({
  imports: [SharedDirectivesModule, CommonModule, FormsModule, LoadingModule, UserEmailComponent],
  exports: [UserEmailComponent],
})
export class UserEmailModule {}
