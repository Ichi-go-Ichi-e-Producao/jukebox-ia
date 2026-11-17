# Correção de segurança Jukeboxia — 18/11/2026

As mudanças estão preparadas na branch `fix/security-aikido-20261118`, a partir de `8456e3d`. Não houve merge em `main`, publicação, AutoFix pago, alteração de scanners ou revogação de credenciais. O catálogo, o código do player, os áudios, as políticas e o patch Wouter permanecem idênticos à base.

## Correções aplicadas

Axios foi fixado em 1.20.0. As cópias transitivas de lodash/lodash-es usam 4.18.1; proxy-addr usa 2.0.8; body-parser usa 1.20.9; qs usa 6.16.1; form-data usa 4.0.6; uuid usa 11.1.1. Nanoid mantém ramos separados em 3.3.18 e 5.1.16, sem override incompatível entre majors.

O build usa Vite 7.3.7. A ferramenta de testes passou a Vitest 4.1.12, que removeu os caminhos antigos de Tinypool e vite-node. O peer instalado do mocker aceita Vite 7 e todas as resoluções Vite do lock são 7.3.7. A tipagem passou a incluir também os testes e sua configuração.

Os demais pisos resolvidos são Browserslist 4.28.7, DOMPurify 3.4.17, path-to-regexp 0.1.13 sob Express 4, Picomatch 4.0.7, PostCSS 8.5.18, Rollup 4.59.0, source-map-js 1.2.2, tar 7.5.21 sob Tailwind oxide e Zod 4.6.7. Foram preservados os consumidores de outros majors e removidos somente os três pins Nanoid antigos substituídos pelos seletores por major.

As Actions foram fixadas por SHA. Build e verificação usam `contents: read`, sem credenciais de checkout persistentes; permissões de Pages e OIDC ficaram no job de deploy. O pnpm permanece em 10.4.1. O workflow novo verifica esta branch e não publica o site.

O servidor Express opcional ganhou cabeçalhos com Helmet 8.3.0 antes dos estáticos e fallback SPA, além de suporte ao prefixo `/jukebox-ia/`. A CSP está em report-only, sem impor isolamento que bloqueie mídia externa. HSTS depende de produção e de HTTPS confiável, sem confiar em cabeçalho de proxy enviado pelo cliente. Esses cabeçalhos não se aplicam ao GitHub Pages, que serve arquivos estáticos.

## Validações locais

A instalação congelada com pnpm 10.4.1 passou. Scripts de instalação foram desativados nesta preparação. A tipagem da aplicação e dos testes passou; 35 testes Vitest e nove testes Python passaram. As travas de prontidão foram verificadas offline, sem operações comerciais. O build de produção passou.

As regressões cobrem catálogo, importação do servidor sem listener, prefixo de assets, MIME, HEAD, pedidos parciais de áudio, cabeçalhos, isolamento dos testes e APIs de dependências com dados pequenos. O teste de tar extrai um arquivo inofensivo em diretório temporário e valida erro de arquivo inválido; não executa exploração ou carga de exaustão.

A prévia final em navegador local tocou as três faixas do tema Família pelo Mundo. Cada uma aceitou pausa, retomada e busca no áudio, com progresso real e duração carregada. Os 13 cards oficiais e seus 13 links Spotify foram preservados; isso não certifica reprodução de todas as faixas nem a disponibilidade das páginas externas.

## O que continua pendente

A auditoria npm final da branch registrou **zero alertas críticos, um alto, onze moderados e três baixos**. Esses contadores não são os grupos Aikido e não provam exploração. O alto restante é **GHSA-fc5q-39xc-vjpf em Picomatch**, vulnerável até 4.0.7. O advisory oficial declara que não há versão corrigida, e o npm ainda publica 4.0.7 como latest. Não ocultamos o alerta nem aplicamos um patch experimental. O consumo identificado está nas ferramentas de glob de build/teste; isso não comprova um endpoint público explorável. Não oferecer padrões não confiáveis a essas ferramentas. [1] [2]

Os moderados/baixos restantes envolvem Babel core, KaTeX, mdast-util-to-hast, Mermaid, PostCSS e postcss-selector-parser. Devem ser avaliados em outro lote compatível, sem interpretar o estado atual como zero vulnerabilidades.

O warning preexistente de peer de Builder JSX Loc 0.1.1 com Vite 7 permanece explícito. Na prévia, três imagens antigas de CDN também falharam; não foram substituídas neste trabalho. O script legado de analytics `/umami` gera aviso no build. Nenhum desses pontos foi ocultado para obter validação verde.

Zod foi atualizado para sair do intervalo publicado, mas a divergência entre o texto do advisory e a correção do mantenedor impede certificar eliminação de todos os cenários com coleções sem limite. Os testes usam dados pequenos e schemas limitados. [3] [4]

A integração em `main`, o deploy e uma nova leitura do scanner Aikido ainda dependem da próxima decisão. Os testes locais não certificam a versão que continua publicada.

## Referências

[1]: https://github.com/advisories/GHSA-fc5q-39xc-vjpf "Picomatch: advisory residual sem versão corrigida"
[2]: https://registry.npmjs.org/picomatch/latest "Registry npm: versão latest Picomatch conferida"
[3]: https://github.com/advisories/GHSA-mrhx-c7xc-m3w5 "Advisory Zod e intervalo publicado"
[4]: https://github.com/colinhacks/zod/pull/6652 "Correção Zod para coleções limitadas"
