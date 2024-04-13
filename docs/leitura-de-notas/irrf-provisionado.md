# IRRF Provisionado

### O que é?

Consideramos como "IRRF provisionado", o IR que é apresentado na nota de corretagem e que não é descontado do valor final da nota.\
Isso quer dizer que, o imposto foi "pré-calculado", mas ainda não foi efetivamente cobrado do cliente.\
Ou seja, o valor líquido da nota não esta considerando o Imposto de Renda Retido na Fonte.

No passado, nós não oferecíamos uma forma de extrair essa informação da nota de corretagem já que não é possível ter certeza se a corretora irá realmente descontar esses valores da conta do cliente ou não.

### Cuidados a serem tomados

Ao utilizar a opção de incluir o imposto provisionado, você deve estar ciente que esse valor pode não ser descontado de sua conta na corretora.

Você deve verificar se a corretora realmente descontou o valor provisionado. Este desconto ocorre normalmente em até 3 dias úteis.

### Day Trade vs Swing Trade

Porque 2 IRRF diferentes?\
Os valores foram separados para facilitar a validação e também para te oferecer mais poder de escolha.

Outro ponto é que no caso do imposto de DayTrade o Leitor faz uma validação básica se o valor lido condiz com os dados da nota de corretagem.

Já no Swing Trade, não é possível fazer esta verificação por conta de diversos fatores.

O IR de ST também pode não ser descontado, dependendo da corretora.

### Valor no Leitor, diferente do da Nota

Caso o Leitor apresente um valor de imposto diferente do que esta na nota.\
Isso é um erro de leitura e você pode reportar este problema através do [formulário de suporte](https://leitordenotas.com.br/suporte.html).

Quando ocorrer da corretora descontar um valor diferente do que esta na nota, isso não é um erro de leitura.
