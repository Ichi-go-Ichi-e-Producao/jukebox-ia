# Operação Lúmen — revisão segura do piloto

Este primeiro fluxo conecta **organização, testes e revisão**, não cobrança nem fulfillment. O repositório musical permanece a fonte da Jukeboxia; Shopify, CJ e Paintory mantêm seus painéis próprios. Não foram adicionadas chaves de fornecedores, dados de clientes, pedidos ou cartões ao GitHub.

## O que foi implementado

O deploy existente agora executa TypeScript, os testes de preservação da coleção e testes de travas operacionais antes do build. Assim, uma falha bloqueia a nova publicação musical sem tocar na versão já publicada.

O workflow **Lumen operational readiness (read-only)** é manual: Actions → escolher o workflow → Run workflow. Ele valida `pilot.json`, testa as travas e consulta somente o HTML público da Jukeboxia com GET. O resultado fica no resumo da execução. Não consulta API Shopify nem APIs de fornecedores, não importa produtos, não ativa cobrança, não envia e-mail e não faz pedido. Sem cron ou trabalho recorrente criado.

**Uma execução verde não quer dizer moletom pronto para vender.** O relatório mostra cada pendência. Custos/quota de GitHub Actions dependem do plano da organização; este fluxo não contrata serviços pagos nem garante cobrança total zero.

## Revisão local

```sh
python3 -m unittest discover -s ops/lumen -p 'test_*.py'
python3 ops/lumen/check_readiness.py --offline --output /tmp/lumen-readiness.md
```

## Passagem comercial — ainda manual

Antes de publicar o piloto, confirmar o SKU criado no fornecedor com a estampa salva, área de impressão, resolução efetiva, variante/cor/tamanho, custo final, frete e prazo. Na Shopify, confirmar canal da vitrine real, carrinho e checkout sem pagamento; o tema ativo consultado em 09/11/2026 é External Redirect. A política de frete estava vazia e a devolução tinha endereço placeholder — corrigir com informações reais, não inventadas.

O usuário realiza a compra de amostra. Registrar recebimento, tecido, tamanho, impressão, embalagem, prazo real e lavagem antes de recomendar qualidade. Não alterar cobrança automática Paintory/CJ; a integração Paintory pode cobrar o cartão cadastrado ao entrar um pedido, conforme documentação oficial.

Atualizar `pilot.json` por revisão explícita, nunca como inferência de um CI verde. A referência de 48 faixas é um snapshot aprovado: futuras adições musicais autorizadas devem atualizar o registro e testes, sem apagar áudio para manter um número fixo. As 13 oficiais não são as sete PT-BR ou seis internacionais desta coleção.

## Marketing orgânico

Postagens de música/bastidores → coleção validada → inscrição com consentimento → uma mensagem de boas-vindas depois de conferir cota. Google & YouTube tem listagens gratuitas, mas campanhas Google Ads não são gratuitas. Forms/Inbox/Flow e Messaging têm condições de plano e consumo; instalação/configuração e envios não fazem parte deste workflow.
