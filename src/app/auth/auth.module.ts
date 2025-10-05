import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'src/app/loading/loading.module';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/shared-directives/shared-directives.module';
import { FullPageLoadingComponent } from '../full-page-loading/full-page-loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    SharedDirectivesModule,
    FullPageLoadingComponent,
    AuthComponent,
  ],
  exports: [AuthComponent],
})
export class AuthModule {}
