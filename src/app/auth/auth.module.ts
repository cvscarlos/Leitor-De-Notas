import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'src/app/loading/loading.module';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';



@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    SharedDirectivesModule,
    FormsModule,
    LoadingModule,
    ReactiveFormsModule,
  ],
  exports: [AuthComponent],
})
export class AuthModule { }
