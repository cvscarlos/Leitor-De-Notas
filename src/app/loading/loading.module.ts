import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoadingComponent],
  imports: [CommonModule],
  exports: [LoadingComponent],
})
export class LoadingModule {}
