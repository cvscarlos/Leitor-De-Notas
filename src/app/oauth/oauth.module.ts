import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OauthComponent } from './oauth.component';

@NgModule({
  declarations: [OauthComponent],
  imports: [CommonModule],
  exports: [OauthComponent],
})
export class OauthModule {}
