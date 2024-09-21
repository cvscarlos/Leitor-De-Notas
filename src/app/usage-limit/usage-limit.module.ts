import { CommonModule } from '@angular/common';
import { LoadingModule } from 'src/app/loading/loading.module';
import { NgModule } from '@angular/core';
import { UsageLimitComponent } from './usage-limit.component';

@NgModule({
  declarations: [UsageLimitComponent],
  imports: [CommonModule, LoadingModule],
})
export class UsageLimitModule {}
