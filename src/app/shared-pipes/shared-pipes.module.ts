import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from './cpf-cnpj/cpf-cnpj.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, CpfCnpjPipe],
  exports: [CpfCnpjPipe],
})
export class SharedPipesModule {}
