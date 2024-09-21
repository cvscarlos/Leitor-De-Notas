import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BinanceComponent } from './binance.component';
import { LoadingModule } from '../loading/loading.module';



@NgModule({
  declarations: [BinanceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
  ],
  exports: [BinanceComponent]
})
export class BinanceModule { }
