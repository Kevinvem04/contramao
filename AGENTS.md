# Regras do Projeto (AGENTS.md)

## Stack & Estilização
- Framework: React + Vite + TypeScript + Tailwind CSS (ou Next.js).
- Ícones: `lucide-react`.

## Regra Estrita de Modularização (Data-Driven)
1. NENHUM texto, link ou caminho de imagem deve ficar fixo (hardcoded) dentro dos componentes em `src/components/sections/`.
2. Todo o conteúdo editável DEVE vir do arquivo `src/config/siteContent.ts`.
3. Todas as imagens locais devem apontar para `/images/nome-da-imagem.ext` (dentro da pasta `public/images/`).

## Regras de Execução Rápida
- Quando o usuário pedir para alterar textos, ofertas, links ou imagens, edite APENAS o arquivo `src/config/siteContent.ts`. Não toque nos arquivos `.tsx` das seções, a menos que seja solicitada uma mudança visual de layout.
- Não rode builds completas a cada alteração simples de texto; confie no Hot Reload do servidor local.