import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { NotifyService } from '../services/notify/notify.service';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private notifyService = inject(NotifyService);

  userSwitchForm: FormGroup;
  unlinkPaymentForm: FormGroup;

  isUserSwitchLoading = false;
  isUnlinkPaymentLoading = false;

  constructor() {
    this.userSwitchForm = this.fb.group({
      emailOrCpf: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.unlinkPaymentForm = this.fb.group({
      paymentId: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  async onUserSwitch() {
    if (!(this.userSwitchForm.valid && !this.isUserSwitchLoading)) {
      return;
    }

    this.isUserSwitchLoading = true;
    try {
      const emailOrCpf = this.userSwitchForm.value.emailOrCpf;
      await this.apiService.adminUserSwitch(emailOrCpf);
      window.location.href = '/minha-conta';
    } finally {
      this.isUserSwitchLoading = false;
    }
  }

  async onUnlinkPayment() {
    if (!(this.unlinkPaymentForm.valid && !this.isUnlinkPaymentLoading)) {
      return;
    }

    this.isUnlinkPaymentLoading = true;
    const paymentId = this.unlinkPaymentForm.value.paymentId;

    try {
      const result = await this.apiService.adminUnlinkPayment(paymentId);
      this.notifyService.success('Sucesso', result.message);
      this.unlinkPaymentForm.reset();
    } finally {
      this.isUnlinkPaymentLoading = false;
    }
  }
}
