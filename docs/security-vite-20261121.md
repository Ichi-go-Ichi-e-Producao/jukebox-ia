# Correção de Vite — 21/11/2026

Vite foi atualizado de 7.3.7 para 7.3.8 para corrigir **GHSA-p4f5-76q4-ffq7**, que inclui a versão anterior no intervalo afetado. A dependência direta e os três overrides foram alinhados e o lockfile foi regenerado com pnpm 10.4.1, a mesma versão fixada no CI. Não houve migração para Vite 8 nem alteração do gerenciador adotado pelo projeto.

A regressão em `server/dependency-security.test.ts` verifica o manifesto e a versão efetivamente resolvida por Vite, Vitest e seu mocker. É uma verificação de versão corrigida, não um teste de exploração. Não foram executados payloads, varreduras de ataque ou testes de exaustão.

## Validação local

A instalação com lockfile congelado passou. A tipagem da aplicação e dos testes passou; os 38 testes Vitest e os nove testes operacionais Python passaram; a prontidão offline e o build de produção com Vite 7.3.8 passaram. O diff confirmou preservação de catálogo, player, arquivos públicos, políticas, patch de Wouter, configuração de Vite e workflows.

O pnpm global disponível no ambiente era 11.25.0 e ignorava a configuração legada em package.json. A validação usou explicitamente pnpm 10.4.1 via npm, sem alterar o gerenciador global, desativar verificações de assinatura ou migrar os overrides. O lockfile manteve o patch de Wouter e os demais overrides. A atualização acrescentou metadados de depreciação já publicados pelo registro, sem atualizar as versões desses outros pacotes.

O aviso de peer de `@builder.io/vite-plugin-jsx-loc` 0.1.1, cujo intervalo declarado cobre Vite 4 e 5, já existia com Vite 7.3.7 e continua visível com 7.3.8. Ele não foi ocultado; o build e os testes foram aprovados.

## Limites e publicação

O aviso oficial exige um servidor de desenvolvimento explicitamente exposto à rede. O comando de desenvolvimento e a configuração permitem essa exposição quando executados, mas sua existência não prova um processo acessível a terceiros. O aviso não estabelece ataque ao site estático do GitHub Pages nem evidencia comprometimento. Qualquer instância de desenvolvimento ainda usando a versão antiga precisa ser atualizada e reiniciada pelo responsável.

A integração deve ocorrer somente após aprovação do CI do pull request e validação da prévia. O deploy automático de main precisa ser confirmado após a integração. O Aikido deve analisar o commit corrigido antes de se afirmar que seu alerta foi encerrado; a atualização do pacote não é prova de segurança total.

## Fontes

- [Aviso oficial GHSA-p4f5-76q4-ffq7](https://github.com/vitejs/vite/security/advisories/GHSA-p4f5-76q4-ffq7)
- [Release oficial Vite 7.3.8](https://github.com/vitejs/vite/releases/tag/v7.3.8)
