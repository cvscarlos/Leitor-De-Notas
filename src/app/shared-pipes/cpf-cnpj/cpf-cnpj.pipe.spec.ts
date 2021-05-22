import { CpfCnpjPipe } from './cpf-cnpj.pipe';

describe('CpfCnpjPipe', () => {
  it('create an instance', () => {
    const pipe = new CpfCnpjPipe();
    expect(pipe).toBeTruthy();
  });
});
