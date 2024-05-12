import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, BinanceResponse } from '../services/api/api.service';
import { NotifyService } from '../services/notify/notify.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.less'],
})
export class BinanceComponent implements OnInit {
  public binanceForm!: FormGroup;
  public loading = false;
  public requestMade = false;
  public fiatPayments: Record<string, string | number>[] = [];
  public fiatOrders: Record<string, string | number>[] = [];
  public trades: Record<string, string | number>[] = [];
  public tradesOCO: Record<string, string | number>[] = [];
  public conversions: Record<string, string | number>[] = [];
  private numericRegex = /^[0-9.]+$/;

  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotifyService,
    private apiService: ApiService,
  ) {}

  public ngOnInit(): void {
    this.binanceForm = this.formBuilder.group({
      binanceApiKey: '',
      binanceSecretKey: '',
    });
  }

  public async submitBinanceForm() {
    const errorsList: string[] = [];
    const promises = [];
    this.loading = true;
    this.requestMade = true;

    const credentials = this.binanceForm.value;

    const parser = ({ results, errors }: BinanceResponse) => {
      if (errors) errorsList.push(...errors);
      results.forEach((t) => this.pointToComma(t));
      return results;
    };

    promises.push(
      this.apiService.binanceFiatPayments(credentials).then((d) => (this.fiatPayments = parser(d))),
    );

    promises.push(
      this.apiService.binanceFiatOrders(credentials).then((d) => (this.fiatOrders = parser(d))),
    );

    promises.push(
      this.apiService.binanceTradesOCO(credentials).then((d) => (this.tradesOCO = parser(d))),
    );

    promises.push(
      this.apiService.binanceTrades(credentials).then((d) => (this.trades = parser(d))),
    );

    promises.push(
      this.apiService.binanceConversions(credentials).then((d) => (this.conversions = parser(d))),
    );

    Promise.all(promises)
      .then(() => {
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this.logError(error);
      });
  }

  private logError(error: unknown) {
    this.notifyService.error('Houve um erro ao tentar buscar os dados da Binance');
    console.error(error);
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
