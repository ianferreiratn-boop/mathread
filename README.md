# MathRead V2

## O que mudou na V2
- O PDF agora recebe uma camada de texto real sobre a página.
- É possível selecionar texto com o mouse/toque em PDFs com texto pesquisável.
- Glossário local com termos matemáticos/probabilidade.
- O glossário tem prioridade sobre tradução genérica para termos reconhecidos.
- Vocabulário salvo no navegador.
- Zoom, navegação e interface responsiva para celular.

## Como rodar
### VS Code
1. Extraia o ZIP.
2. Abra a pasta no VS Code.
3. Instale a extensão Live Server.
4. Botão direito em `index.html` → Open with Live Server.

### Python
Na pasta:
`python -m http.server 8000`

Abra `http://localhost:8000`.

## Internet
A leitura do PDF e o vocabulário local funcionam no navegador. A tradução genérica usa MyMemory, então traduções que não estiverem no glossário precisam de internet.

## Limitação conhecida
PDFs escaneados como imagem não têm camada de texto. Para esses casos, a próxima versão pode incluir OCR.

## Ideia para V3
- OCR para PDFs escaneados.
- Tradução contextual por IA.
- Explicação matemática do trecho selecionado.
- Glossário maior por área (Análise, Álgebra, Probabilidade, Estatística etc.).
- PWA instalável no celular.
- Conta/sincronização entre dispositivos.
