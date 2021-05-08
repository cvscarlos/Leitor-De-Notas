import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageLimitComponent } from './usage-limit.component';
import { LoadingModule } from '../loading/loading.module';



@NgModule({
    declarations: [UsageLimitComponent],
    imports: [
        CommonModule,
        LoadingModule
    ]
})
export class UsageLimitModule { }
