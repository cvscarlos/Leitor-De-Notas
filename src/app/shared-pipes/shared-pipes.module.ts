import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from './cpf-cnpj/cpf-cnpj.pipe';
import { NgModule } from '@angular/core';



@NgModule({
  declarations: [CpfCnpjPipe],
  imports: [CommonModule],
  exports: [CpfCnpjPipe],
})
export class SharedPipesModule { }
