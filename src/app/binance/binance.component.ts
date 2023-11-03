import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.less'],
})
export class BinanceComponent implements OnInit {
  public binanceForm!: FormGroup;
  public loading = false;
  public fiatTransactions: Record<string, string>[] = [];
  public trades: Record<string, string>[] = [];
  private numericRegex = /^[0-9.]+$/;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {}

  public ngOnInit(): void {
    this.binanceForm = this.formBuilder.group({
      binanceApiKey: '',
      binanceSecretKey: '',
    });
  }

  public async submitBinanceForm() {
    this.loading = true;
    try {
      const credentials = this.binanceForm.value;

      const fiat = await this.apiService.binanceFiatTransactions(credentials);
      fiat.forEach((t) => this.pointToComma(t));
      this.fiatTransactions = fiat;

      const trades = await this.apiService.binanceTrades(credentials);
      trades.forEach((t) => this.pointToComma(t));
      this.trades = trades;
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }

  private pointToComma(obj: Record<string, unknown>) {
    Object.keys(obj).forEach((key) => {
      const value = String(obj[key]);
      if (this.numericRegex.test(value)) {
        obj[key] = value.replace('.', ',');
      }
    });
  }
}
