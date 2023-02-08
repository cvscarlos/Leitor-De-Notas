import { AppRoutingModule } from 'src/app/app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from 'src/app/loading/loading.module';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared-pipes/shared-pipes.module';
import { UserAccountComponent } from './user-account.component';



@NgModule({
  declarations: [UserAccountComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedDirectivesModule,
    FormsModule,
    LoadingModule,
    SharedPipesModule,
  ],
  exports: [UserAccountComponent],
})
export class UserAccountModule { }
