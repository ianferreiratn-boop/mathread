# MathRead V5

Leitor de artigos matemáticos em inglês inspirado no fluxo do EWA, agora com um glossário especialmente reforçado para **probabilidade, processos estocásticos, sequências de moedas e probabilidade contraintuitiva**.

## V5 — foco em probabilidade
- Mantém o toque em uma palavra e a seleção de frases da V4.
- Banco local muito maior de inglês matemático.
- Camada especializada para probabilidade: eventos, independência, Bayes, variáveis aleatórias, distribuições, esperança, convergência e leis limite.
- Camada especializada para processos estocásticos: cadeias de Markov, passeios aleatórios, martingais, tempos de parada, processos de Poisson, renovação, ramificação e movimento browniano.
- **Camada especial para a IC:** lançamentos de moedas, sequências binárias, padrões, sobreposição, prefixos/sufixos, tempos de espera, corridas de padrões e **Penney's game / Penney-ante**.
- Vocabulário de probabilidade contraintuitiva: Monty Hall, Bertrand, aniversário, Simpson, São Petersburgo, falácia do jogador, dados não transitivos, ruína do jogador e outros.
- Vocabulário de desigualdades e ferramentas: Markov, Chebyshev, Jensen, Chernoff, Hoeffding, Borel-Cantelli, leis zero-um etc.
- Linguagem típica de artigos: *with high probability*, *eventually*, *infinitely often*, *conditioned on*, *under suitable assumptions* etc.
- O glossário local tem prioridade sobre a tradução automática, evitando traduções genéricas de termos técnicos conhecidos.

## Referências de domínio usadas para orientar o vocabulário
O banco foi organizado com base em terminologia recorrente em cursos/textos de probabilidade e em materiais sobre jogos e paradoxos. Por exemplo, um texto de introdução à probabilidade cobre distribuições, probabilidade condicional, esperança, lei dos grandes números, TCL e cadeias de Markov; materiais de processos estocásticos incluem cadeias de Markov, passeios aleatórios, difusões, processos de nascimento e morte e ramificação. O exemplo clássico de Penney-ante envolve padrões de caras/coroas, competição entre sequências e a fórmula de Conway.

## Limitações
- PDFs escaneados/imagem ainda precisam de OCR para que as palavras possam ser tocadas.
- Quando uma expressão não está no glossário, a V5 usa tradução automática.
- O glossário não pretende conter literalmente todas as palavras da literatura; ele prioriza vocabulário de alta utilidade e pode continuar crescendo por áreas.
- Explicações contextualizadas por IA com o artigo inteiro são uma etapa futura e devem ser implementadas por um backend seguro, sem expor chave de API no navegador.

## GitHub Pages
Substitua os arquivos da versão anterior no repositório e faça commit. O GitHub Pages atualizará o mesmo endereço.
