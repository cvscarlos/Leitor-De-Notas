# Desconsiderar a informação de Day Trade nos Exercícios de Opções

Algumas corretoras trazem as operações de Exercício de Opções onde a Compra / Venda ocorre no mesmo dia. Como uma operação de Day Trade.

A Receita Federel, na [Instrução Normativa 1585, Art. 65, § 13](http://normas.receita.fazenda.gov.br/sijut2consulta/link.action?visao=anotado&idAto=67494#1563902), diz:

> _§ 13. Não se caracteriza como day-trade:_
>
> _I - o exercício da opção e a venda ou compra do ativo no mercado à vista, no mesmo dia;_
>
> _II - o exercício da opção e a venda ou compra do contrato futuro objeto, no mesmo dia._

Neste cenário, existe uma norma dizendo que não é Day Trade, ao mesmo tempo, o documento da corretora diz que é Day Trade.

Para dar mais flexibilidade ao usuário, é possível escolher se deseja manter as informações de Day Trade conforme documento oficial que é a nota de corretagem, ou se prefere considerar como operações normais (não Day Trade) amparando-se na norma da RF.

Em resumo, o que essa configuração faz, é sempre tratar as operações de Exercício de Opções, como operações normais, ou seja, não é Day Trade.

Por padrão essa opção vem desmarcada, ou seja, mantém-se a informação original da nota de corretagem.

---

**Exemplo de nota de corretagem** com exercício de opção e compra / venda no mesmo dia:

![](https://blackhole.customerly.io/attachments/ded6585e/accounts/29323/4399535d94657e8a0d9a9715659e6801/image.png)

**Exemplo do resultado do Leitor de Notas no modo padrão:**

![](https://blackhole.customerly.io/attachments/ded6585e/accounts/29323/5637c2e56ad5ae5fbb3b6574ed3c5d97/image.png)

**Exemplo do resultado do Leitor de Notas, com a opção de desconsiderar Day Trade ativada:**

![](https://blackhole.customerly.io/attachments/ded6585e/accounts/29323/7df3debb08008ecb8b991a9fafeafe36/image.png)
