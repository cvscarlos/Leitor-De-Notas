import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from '../shared-directives/shared-directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { NgModule } from '@angular/core';



@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    SharedDirectivesModule,
    FormsModule,
    LoadingModule,
    ReactiveFormsModule,
  ],
  exports: [AuthComponent]
})
export class AuthModule { }
