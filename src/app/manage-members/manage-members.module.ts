import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { ManageMembersComponent } from './manage-members.component';
import { NgModule } from '@angular/core';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';



@NgModule({
  declarations: [ ManageMembersComponent ],
  imports: [
    CommonModule,
    FormsModule,
    LoadingModule,
    SharedPipesModule,
  ],
  exports: [ManageMembersComponent],
})
export class ManageMembersModule { }
