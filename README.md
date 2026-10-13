# Bíblia 365

Aplicativo web para acompanhar 365 dias de leitura na Bíblia física. O plano pode começar em qualquer data, sem depender de janeiro.

## Funcionalidades

- Data de início personalizada e datas calculadas para as 365 leituras.
- Referências por livro, com capítulos e versículos escritos por extenso.
- Marcação de leituras concluídas, com opção de desfazer.
- Painel com percentual de progresso, leituras restantes e acesso à primeira leitura pendente.
- Calendário em blocos de 30 dias e histórico de leituras concluídas.
- Layout adaptado para computador e celular.

O aplicativo apresenta o plano e as referências. A leitura do texto bíblico é feita na Bíblia física.

## Executar localmente

Utilize uma versão atual do Node.js compatível com o Vite 8 e npm.

```sh
npm ci
npm run dev
```

## Gerar a versão de produção

```sh
npm run build
npm run preview
```

Os arquivos de produção são gerados na pasta `dist`.

## Tecnologias

React, TypeScript, Vite e Lucide React.

O plano está em `src/data/planoLeitura.ts`. O cálculo das datas está em `src/data/datasPlano.ts`, e a apresentação das referências em `src/data/referencias.ts`.

## Progresso

A data de início, a leitura selecionada e os dias concluídos ficam no armazenamento local do navegador. Alterar a data de início preserva as marcações. Não há conta de usuário ou sincronização entre dispositivos; limpar os dados do navegador remove o progresso salvo.

## Verificação

`npm run build` verifica o TypeScript e gera a versão de produção. `npm run lint` executa o Oxlint; a política de controle de aplicativos do Windows pode bloquear seu componente nativo.
