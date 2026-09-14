import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

const $=id=>document.getElementById(id);
const canvas=$("canvas"),ctx=canvas.getContext("2d"),layer=$("textLayer"),wrap=$("pageWrap");
let pdf=null,page=1,scale=1.25,readingMode=true,currentTextItems=[],currentToken=null,currentFileName="";
let pointerInfo=null,lastPointerAt=0,rendering=false;
let vocab=JSON.parse(localStorage.getItem("mathread_vocab_v5")||localStorage.getItem("mathread_vocab_v4")||localStorage.getItem("mathread_vocab_v3")||"[]");

// Glossário inicial amplo de inglês matemático. Expressões mais longas são consultadas antes de palavras isoladas.
const D={
"a.e.":"q.c. / quase certamente", "a.s.":"q.c. / quase certamente", "almost surely":"quase certamente", "almost everywhere":"quase em todo lugar", "with probability one":"com probabilidade um", "in probability":"em probabilidade", "in distribution":"em distribuição", "in law":"em distribuição", "law of large numbers":"lei dos grandes números", "central limit theorem":"teorema central do limite", "random variable":"variável aleatória", "random variables":"variáveis aleatórias", "random vector":"vetor aleatório", "random process":"processo aleatório", "random dynamical system":"sistema dinâmico aleatório", "stochastic process":"processo estocástico", "sample space":"espaço amostral", "probability space":"espaço de probabilidade", "probability measure":"medida de probabilidade", "conditional probability":"probabilidade condicional", "conditional expectation":"esperança condicional", "conditional distribution":"distribuição condicional", "independent and identically distributed":"independentes e identicamente distribuídas", "independent identically distributed":"independentes e identicamente distribuídas", "expected value":"valor esperado", "expectation":"esperança", "variance":"variância", "standard deviation":"desvio-padrão", "covariance":"covariância", "correlation coefficient":"coeficiente de correlação", "probability density":"densidade de probabilidade", "probability distribution":"distribuição de probabilidade", "cumulative distribution function":"função de distribuição acumulada", "probability mass function":"função de massa de probabilidade", "moment generating function":"função geradora de momentos", "characteristic function":"função característica", "almost everywhere":"quase em todo lugar", "measurable space":"espaço mensurável", "measurable function":"função mensurável", "measurable set":"conjunto mensurável", "sigma algebra":"sigma-álgebra", "sigma-algebra":"sigma-álgebra", "borel set":"conjunto de Borel", "borel measurable":"mensurável de Borel", "lebesgue measure":"medida de Lebesgue", "measure zero":"medida zero", "null set":"conjunto nulo",
"convergence in probability":"convergência em probabilidade", "almost sure convergence":"convergência quase certa", "convergence in distribution":"convergência em distribuição", "uniform convergence":"convergência uniforme", "pointwise convergence":"convergência pontual", "absolute convergence":"convergência absoluta", "conditional convergence":"convergência condicional", "converges":"converge", "convergent":"convergente", "convergence":"convergência", "diverges":"diverge", "divergent":"divergente", "divergence":"divergência", "sequence":"sequência", "subsequence":"subsequência", "series":"série", "power series":"série de potências", "telescoping series":"série telescópica", "limit":"limite", "limiting":"limite / tendendo", "bounded":"limitado(a)", "unbounded":"ilimitado(a)", "upper bound":"cota superior", "lower bound":"cota inferior", "least upper bound":"menor cota superior", "greatest lower bound":"maior cota inferior", "supremum":"supremo", "infimum":"ínfimo",
"continuous":"contínuo(a)", "continuity":"continuidade", "uniformly continuous":"uniformemente contínuo(a)", "differentiable":"diferenciável", "differentiability":"diferenciabilidade", "derivative":"derivada", "partial derivative":"derivada parcial", "directional derivative":"derivada direcional", "gradient":"gradiente", "jacobian":"jacobiana", "hessian":"hessiana", "integrable":"integrável", "integrability":"integrabilidade", "integral":"integral", "definite integral":"integral definida", "indefinite integral":"integral indefinida", "antiderivative":"primitiva", "fundamental theorem of calculus":"teorema fundamental do cálculo", "mean value theorem":"teorema do valor médio", "intermediate value theorem":"teorema do valor intermediário", "function":"função", "mapping":"aplicação", "map":"aplicação", "domain":"domínio", "codomain":"contradomínio", "range":"imagem", "image":"imagem", "preimage":"imagem inversa", "inverse function":"função inversa", "composition":"composição", "injective":"injetiva", "surjective":"sobrejetiva", "bijective":"bijetiva",
"set":"conjunto", "sets":"conjuntos", "subset":"subconjunto", "proper subset":"subconjunto próprio", "empty set":"conjunto vazio", "universal set":"conjunto universo", "union":"união", "intersection":"interseção", "complement":"complemento", "cartesian product":"produto cartesiano", "power set":"conjunto das partes", "cardinality":"cardinalidade", "finite":"finito(a)", "infinite":"infinito(a)", "countable":"enumerável", "uncountable":"não enumerável", "equivalence relation":"relação de equivalência", "equivalence class":"classe de equivalência", "partition":"partição", "relation":"relação", "element":"elemento", "belongs to":"pertence a",
"group":"grupo", "abelian group":"grupo abeliano", "commutative group":"grupo comutativo", "subgroup":"subgrupo", "normal subgroup":"subgrupo normal", "quotient group":"grupo quociente", "cyclic group":"grupo cíclico", "group homomorphism":"homomorfismo de grupos", "group isomorphism":"isomorfismo de grupos", "kernel":"núcleo", "image":"imagem", "coset":"classe lateral", "left coset":"classe lateral à esquerda", "right coset":"classe lateral à direita", "order of an element":"ordem de um elemento", "finite group":"grupo finito", "ring":"anel", "commutative ring":"anel comutativo", "integral domain":"domínio de integridade", "field":"corpo", "subfield":"subcorpo", "polynomial ring":"anel de polinômios", "ideal":"ideal", "principal ideal":"ideal principal", "quotient ring":"anel quociente", "field extension":"extensão de corpos", "vector space":"espaço vetorial", "subspace":"subespaço", "linear combination":"combinação linear", "linear independence":"independência linear", "linearly independent":"linearmente independente", "basis":"base", "dimension":"dimensão", "span":"espaço gerado", "linear transformation":"transformação linear", "linear operator":"operador linear", "eigenvalue":"autovalor", "eigenvector":"autovetor", "eigenspace":"autoespaço", "characteristic polynomial":"polinômio característico", "minimal polynomial":"polinômio minimal", "inner product":"produto interno", "inner product space":"espaço com produto interno", "orthogonal":"ortogonal", "orthonormal":"ortonormal", "norm":"norma", "normed space":"espaço normado", "banach space":"espaço de Banach", "hilbert space":"espaço de Hilbert", "matrix":"matriz", "determinant":"determinante", "trace":"traço", "rank":"posto", "null space":"núcleo", "inverse matrix":"matriz inversa", "transpose":"transposta", "symmetric matrix":"matriz simétrica", "positive definite":"definida positiva",
"metric space":"espaço métrico", "metric":"métrica", "distance":"distância", "open set":"conjunto aberto", "closed set":"conjunto fechado", "neighborhood":"vizinhança", "interior":"interior", "closure":"fecho", "boundary":"fronteira", "compact":"compacto(a)", "compactness":"compacidade", "connected":"conexo(a)", "connectedness":"conexidade", "path connected":"conexo por caminhos", "topological space":"espaço topológico", "topology":"topologia", "homeomorphism":"homeomorfismo", "homeomorphic":"homeomorfo(a)", "continuous map":"aplicação contínua", "open cover":"cobertura aberta", "finite subcover":"subcobertura finita", "complete":"completo(a)", "completeness":"completude", "cauchy sequence":"sequência de Cauchy", "dense":"denso(a)", "separable":"separável",
"theorem":"teorema", "lemma":"lema", "proposition":"proposição", "corollary":"corolário", "conjecture":"conjectura", "proof":"demonstração", "proof by contradiction":"demonstração por contradição", "direct proof":"demonstração direta", "counterexample":"contraexemplo", "assumption":"hipótese", "hypothesis":"hipótese", "claim":"afirmação", "statement":"enunciado", "remark":"observação", "definition":"definição", "example":"exemplo", "suppose":"suponha", "assume":"suponha", "let":"seja", "hence":"portanto", "therefore":"portanto", "thus":"assim", "consequently":"consequentemente", "it follows that":"segue que", "if and only if":"se, e somente se", "if and only if":"se, e somente se", "such that":"tal que", "for all":"para todo", "there exists":"existe", "there exist":"existem", "without loss of generality":"sem perda de generalidade", "wlog":"sem perda de generalidade", "respectively":"respectivamente", "namely":"a saber", "whereas":"enquanto que", "denote":"denote", "denoted by":"denotado por",
"algorithm":"algoritmo", "complexity":"complexidade", "computational complexity":"complexidade computacional", "graph":"grafo", "vertex":"vértice", "vertices":"vértices", "edge":"aresta", "edges":"arestas", "path":"caminho", "cycle":"ciclo", "connected graph":"grafo conexo", "directed graph":"grafo orientado", "undirected graph":"grafo não orientado", "tree":"árvore", "spanning tree":"árvore geradora", "degree":"grau", "adjacency matrix":"matriz de adjacência", "combinatorics":"combinatória", "permutation":"permutação", "combination":"combinação", "binomial coefficient":"coeficiente binomial", "pigeonhole principle":"princípio da casa dos pombos", "inclusion-exclusion principle":"princípio da inclusão-exclusão", "recurrence relation":"relação de recorrência", "generating function":"função geradora",
"real number":"número real", "integer":"inteiro", "natural number":"número natural", "rational number":"número racional", "irrational number":"número irracional", "complex number":"número complexo", "real line":"reta real", "real-valued":"a valores reais", "integer-valued":"a valores inteiros", "positive":"positivo(a)", "negative":"negativo(a)", "nonnegative":"não negativo(a)", "nonzero":"não nulo", "strictly positive":"estritamente positivo", "absolute value":"valor absoluto", "square root":"raiz quadrada", "logarithm":"logaritmo", "exponential":"exponencial", "polynomial":"polinômio", "degree of a polynomial":"grau de um polinômio", "coefficient":"coeficiente", "root":"raiz", "zero of a function":"zero de uma função", "factorization":"fatoração", "inequality":"desigualdade", "equality":"igualdade", "equation":"equação", "identity":"identidade",
"random":"aleatório(a)", "stochastic":"estocástico(a)", "correlation":"correlação", "entropy":"entropia", "dimension":"dimensão", "correlation dimension":"dimensão de correlação", "renyi entropy":"entropia de Rényi", "mixing":"mistura", "mixing rate":"taxa de mistura", "ergodic":"ergódico(a)", "ergodicity":"ergodicidade", "invariant measure":"medida invariante", "stationary":"estacionário(a)", "stationarity":"estacionariedade", "markov chain":"cadeia de Markov", "transition probability":"probabilidade de transição", "transition matrix":"matriz de transição", "martingale":"martingal", "filtration":"filtração", "stopping time":"tempo de parada", "brownian motion":"movimento browniano", "stochastic differential equation":"equação diferencial estocástica",
"partial differential equation":"equação diferencial parcial", "ordinary differential equation":"equação diferencial ordinária", "differential equation":"equação diferencial", "initial condition":"condição inicial", "boundary condition":"condição de contorno", "initial value problem":"problema de valor inicial", "boundary value problem":"problema de contorno", "solution":"solução", "unique solution":"solução única", "existence and uniqueness":"existência e unicidade", "stability":"estabilidade", "stable":"estável", "unstable":"instável", "fixed point":"ponto fixo", "equilibrium":"equilíbrio", "dynamical system":"sistema dinâmico", "orbit":"órbita", "periodic orbit":"órbita periódica", "trajectory":"trajetória", "attractor":"atrator", "invariant":"invariante", "chaotic":"caótico(a)", "chaos":"caos",
"optimization":"otimização", "objective function":"função objetivo", "constraint":"restrição", "constrained optimization":"otimização com restrições", "unconstrained optimization":"otimização sem restrições", "local minimum":"mínimo local", "local maximum":"máximo local", "global minimum":"mínimo global", "global maximum":"máximo global", "convex":"convexo(a)", "convexity":"convexidade", "concave":"côncavo(a)", "gradient descent":"descida do gradiente", "critical point":"ponto crítico", "saddle point":"ponto de sela",
"measure":"medida", "measurable":"mensurável", "support":"suporte", "density":"densidade", "weak convergence":"convergência fraca", "weak derivative":"derivada fraca", "distributional derivative":"derivada no sentido das distribuições", "almost everywhere":"quase em todo lugar", "essential supremum":"supremo essencial", "essential infimum":"ínfimo essencial",
"nearly":"quase", "approximately":"aproximadamente", "sufficiently":"suficientemente", "arbitrary":"arbitrário(a)", "unique":"único(a)", "existence":"existência", "uniqueness":"unicidade", "necessary":"necessário(a)", "sufficient":"suficiente", "equivalent":"equivalente", "equivalence":"equivalência", "implies":"implica", "implied":"implicado(a)", "holds":"vale", "valid":"válido(a)", "finite":"finito(a)", "infinite":"infinito(a)", "where":"onde", "over":"sobre", "throughout":"ao longo de", "respectively":"respectivamente", "particular":"particular", "arbitrarily":"arbitrariamente", "eventually":"eventualmente", "otherwise":"caso contrário", "indeed":"de fato", "clearly":"claramente", "obviously":"obviamente", "similarly":"similarmente", "analogously":"analogamente", "straightforward":"direto(a)", "trivial":"trivial", "nontrivial":"não trivial", "standard":"padrão", "classical":"clássico(a)", "natural":"natural", "canonical":"canônico(a)", "generic":"genérico(a)", "specific":"específico(a)", "finite-dimensional":"de dimensão finita", "infinite-dimensional":"de dimensão infinita"
};

// MathRead V5 — Banco especializado em probabilidade, processos estocásticos,
// sequências de lançamentos e problemas/paradoxos contraintuitivos.
// As traduções abaixo são um glossário local; expressões longas têm prioridade.
Object.assign(D, {
  // Fundamentos de probabilidade
  "outcome":"resultado", "elementary outcome":"resultado elementar", "event":"evento", "events":"eventos",
  "sample point":"ponto amostral", "sample points":"pontos amostrais", "sample space":"espaço amostral",
  "event space":"espaço de eventos", "sure event":"evento certo", "impossible event":"evento impossível",
  "complementary event":"evento complementar", "complement":"complemento", "union":"união", "intersection":"interseção",
  "disjoint events":"eventos disjuntos", "mutually exclusive":"mutuamente exclusivos", "pairwise disjoint":"dois a dois disjuntos",
  "collectively exhaustive":"exaustivos em conjunto", "partition":"partição", "partition of the sample space":"partição do espaço amostral",
  "probability":"probabilidade", "probabilities":"probabilidades", "probabilistic":"probabilístico(a)",
  "probability function":"função de probabilidade", "probability measure":"medida de probabilidade",
  "probability distribution":"distribuição de probabilidade", "probability law":"lei de probabilidade",
  "axiom":"axioma", "axioms of probability":"axiomas da probabilidade", "Kolmogorov axioms":"axiomas de Kolmogorov",
  "countable additivity":"aditividade contável", "finite additivity":"aditividade finita", "normalization":"normalização",
  "total probability":"probabilidade total", "law of total probability":"lei da probabilidade total",
  "conditional probability":"probabilidade condicional", "conditional event":"evento condicional",
  "conditional on":"condicionado a", "given that":"dado que", "provided that":"desde que / dado que",
  "Bayes' theorem":"teorema de Bayes", "Bayes theorem":"teorema de Bayes", "Bayesian":"bayesiano(a)",
  "Bayesian inference":"inferência bayesiana", "prior probability":"probabilidade a priori", "prior distribution":"distribuição a priori",
  "posterior probability":"probabilidade a posteriori", "posterior distribution":"distribuição a posteriori",
  "likelihood":"verossimilhança", "likelihood function":"função de verossimilhança", "evidence":"evidência",
  "base rate":"taxa-base", "base-rate fallacy":"falácia da taxa-base", "odds":"odds / chances", "odds ratio":"razão de chances",
  "independence":"independência", "independent events":"eventos independentes", "conditionally independent":"condicionalmente independentes",
  "conditional independence":"independência condicional", "pairwise independent":"independentes dois a dois",
  "mutually independent":"mutuamente independentes", "exchangeable":"permutável / intercambiável", "exchangeability":"permutabilidade / intercambiabilidade",
  "random experiment":"experimento aleatório", "random trial":"ensaio aleatório", "experiment":"experimento",
  "trial":"ensaio", "repeated trials":"ensaios repetidos", "fair coin":"moeda justa", "biased coin":"moeda viciada",
  "fair die":"dado justo", "loaded die":"dado viciado", "fair game":"jogo justo", "fairness":"justiça / equidade do jogo",

  // Variáveis aleatórias e distribuições
  "random variable":"variável aleatória", "random variables":"variáveis aleatórias", "discrete random variable":"variável aleatória discreta",
  "continuous random variable":"variável aleatória contínua", "real-valued random variable":"variável aleatória real",
  "integer-valued random variable":"variável aleatória com valores inteiros", "random vector":"vetor aleatório",
  "random sequence":"sequência aleatória", "random field":"campo aleatório", "random measure":"medida aleatória",
  "support":"suporte", "probability mass function":"função massa de probabilidade", "probability density function":"função densidade de probabilidade",
  "density":"densidade", "mass function":"função massa", "distribution function":"função de distribuição",
  "cumulative distribution function":"função de distribuição acumulada", "survival function":"função de sobrevivência",
  "tail probability":"probabilidade de cauda", "tail distribution":"distribuição de cauda", "quantile":"quantil", "quantile function":"função quantil",
  "median":"mediana", "mode":"moda", "mean":"média", "arithmetic mean":"média aritmética", "expected value":"valor esperado",
  "expectation":"esperança", "conditional expectation":"esperança condicional", "variance":"variância", "standard deviation":"desvio-padrão",
  "standard error":"erro-padrão", "covariance":"covariância", "correlation":"correlação", "correlation coefficient":"coeficiente de correlação",
  "moment":"momento", "raw moment":"momento ordinário", "central moment":"momento central", "factorial moment":"momento fatorial",
  "moment generating function":"função geradora de momentos", "probability generating function":"função geradora de probabilidades",
  "characteristic function":"função característica", "cumulant":"cumulante", "cumulant generating function":"função geradora de cumulantes",
  "Bernoulli distribution":"distribuição de Bernoulli", "binomial distribution":"distribuição binomial", "geometric distribution":"distribuição geométrica",
  "negative binomial distribution":"distribuição binomial negativa", "hypergeometric distribution":"distribuição hipergeométrica",
  "Poisson distribution":"distribuição de Poisson", "multinomial distribution":"distribuição multinomial",
  "uniform distribution":"distribuição uniforme", "discrete uniform distribution":"distribuição uniforme discreta",
  "continuous uniform distribution":"distribuição uniforme contínua", "normal distribution":"distribuição normal",
  "Gaussian distribution":"distribuição gaussiana", "standard normal distribution":"distribuição normal padrão",
  "exponential distribution":"distribuição exponencial", "gamma distribution":"distribuição gama", "beta distribution":"distribuição beta",
  "chi-square distribution":"distribuição qui-quadrado", "Student's t distribution":"distribuição t de Student",
  "F distribution":"distribuição F", "lognormal distribution":"distribuição lognormal", "Cauchy distribution":"distribuição de Cauchy",
  "Pareto distribution":"distribuição de Pareto", "power law":"lei de potência", "heavy-tailed":"de cauda pesada", "light-tailed":"de cauda leve",
  "long-tailed":"de cauda longa", "degenerate distribution":"distribuição degenerada", "mixture distribution":"distribuição mistura",

  // Convergência e leis limite
  "convergence in probability":"convergência em probabilidade", "almost sure convergence":"convergência quase certa",
  "almost surely":"quase certamente", "almost everywhere":"quase em todo lugar", "with probability one":"com probabilidade um",
  "convergence in distribution":"convergência em distribuição", "convergence in law":"convergência em lei",
  "convergence in mean":"convergência em média", "convergence in L1":"convergência em L1", "convergence in L2":"convergência em L2",
  "convergence in mean square":"convergência em média quadrática", "weak convergence":"convergência fraca",
  "weakly converges":"converge fracamente", "tightness":"tensão / tightness", "tight":"tenso / tight", "uniform integrability":"integrabilidade uniforme",
  "law of large numbers":"lei dos grandes números", "weak law of large numbers":"lei fraca dos grandes números",
  "strong law of large numbers":"lei forte dos grandes números", "central limit theorem":"teorema central do limite",
  "local central limit theorem":"teorema central do limite local", "multivariate central limit theorem":"teorema central do limite multivariado",
  "law of the iterated logarithm":"lei do logaritmo iterado", "large deviations":"grandes desvios", "large deviation principle":"princípio dos grandes desvios",
  "moderate deviations":"desvios moderados", "invariance principle":"princípio de invariância", "functional central limit theorem":"teorema central do limite funcional",
  "limit theorem":"teorema limite", "limiting distribution":"distribuição limite", "asymptotic distribution":"distribuição assintótica",
  "asymptotically normal":"assintoticamente normal", "asymptotic behavior":"comportamento assintótico", "rate of convergence":"taxa de convergência",

  // Contagem e combinações úteis em probabilidade
  "counting argument":"argumento de contagem", "counting principle":"princípio de contagem", "permutation":"permutação", "permutations":"permutações",
  "combination":"combinação", "combinations":"combinações", "binomial coefficient":"coeficiente binomial", "multinomial coefficient":"coeficiente multinomial",
  "occupancy problem":"problema de ocupação", "occupancy model":"modelo de ocupação", "balls and bins":"bolas e urnas",
  "urn model":"modelo de urnas", "coupon collector":"colecionador de cupons", "coupon collector problem":"problema do colecionador de cupons",
  "birthday problem":"problema do aniversário", "birthday paradox":"paradoxo do aniversário", "birthday collision":"colisão de aniversários",
  "collision probability":"probabilidade de colisão", "collision problem":"problema de colisões", "matching problem":"problema de coincidências",
  "derangement":"desarranjo", "inclusion-exclusion":"inclusão-exclusão", "inclusion-exclusion principle":"princípio da inclusão-exclusão",
  "pigeonhole principle":"princípio da casa dos pombos", "sampling without replacement":"amostragem sem reposição",
  "sampling with replacement":"amostragem com reposição", "with replacement":"com reposição", "without replacement":"sem reposição",

  // Sequências de moedas e padrões — núcleo especial da IC
  "coin toss":"lançamento de moeda", "coin tossing":"lançamentos de moeda", "coin flip":"lançamento de moeda", "coin flips":"lançamentos de moeda",
  "heads":"cara", "head":"cara", "tails":"coroa", "tail":"coroa", "sequence of coin tosses":"sequência de lançamentos de moeda",
  "binary sequence":"sequência binária", "binary string":"palavra binária", "string":"palavra / cadeia", "pattern":"padrão",
  "pattern matching":"casamento de padrões", "pattern occurrence":"ocorrência de padrão", "pattern occurrences":"ocorrências de padrões",
  "pattern matching problem":"problema de casamento de padrões", "pattern waiting time":"tempo de espera pelo padrão",
  "waiting time":"tempo de espera", "waiting time distribution":"distribuição do tempo de espera", "first occurrence":"primeira ocorrência",
  "first passage time":"tempo de primeira passagem", "first hitting time":"tempo do primeiro atingimento", "hitting time":"tempo de atingimento",
  "stopping time":"tempo de parada", "stopping rule":"regra de parada", "stopping problem":"problema de parada",
  "run":"sequência consecutiva / corrida", "runs":"sequências consecutivas", "run length":"comprimento da sequência consecutiva",
  "longest run":"maior sequência consecutiva", "run distribution":"distribuição de sequências consecutivas", "runs of heads":"sequências consecutivas de caras",
  "runs of tails":"sequências consecutivas de coroas", "alternating sequence":"sequência alternada", "alternating runs":"sequências alternadas",
  "overlap":"sobreposição", "overlapping patterns":"padrões sobrepostos", "pattern overlap":"sobreposição de padrões",
  "self-overlap":"auto-sobreposição", "border":"borda / prefixo-sufixo comum", "prefix":"prefixo", "suffix":"sufixo",
  "proper prefix":"prefixo próprio", "proper suffix":"sufixo próprio", "prefix-suffix overlap":"sobreposição prefixo-sufixo",
  "non-overlapping":"sem sobreposição", "overlapping occurrences":"ocorrências sobrepostas", "pattern competition":"competição entre padrões",
  "pattern race":"corrida entre padrões", "pattern waiting game":"jogo de espera por padrões", "pattern probability":"probabilidade de padrão",
  "pattern occurrence time":"tempo de ocorrência do padrão", "pattern hitting time":"tempo de atingimento do padrão",
  "Penney's game":"jogo de Penney", "Penney game":"jogo de Penney", "Penney-ante":"Penney-ante", "Penney's game strategy":"estratégia do jogo de Penney",
  "Conway's formula":"fórmula de Conway", "Conway leading number":"número líder de Conway", "pattern odds":"odds entre padrões",
  "competing patterns":"padrões concorrentes", "competing sequences":"sequências concorrentes", "sequence race":"corrida de sequências",
  "winner":"vencedor", "loser":"perdedor", "winning pattern":"padrão vencedor", "first pattern to appear":"primeiro padrão a aparecer",
  "fair coin tosses":"lançamentos de moeda justa", "biased coin tosses":"lançamentos de moeda viciada",
  "Bernoulli trials":"ensaios de Bernoulli", "Bernoulli sequence":"sequência de Bernoulli", "Bernoulli process":"processo de Bernoulli",
  "independent coin tosses":"lançamentos de moeda independentes", "successive tosses":"lançamentos sucessivos", "successive trials":"ensaios sucessivos",

  // Processos estocásticos e cadeias
  "stochastic process":"processo estocástico", "random process":"processo aleatório", "discrete-time process":"processo em tempo discreto",
  "continuous-time process":"processo em tempo contínuo", "stationary process":"processo estacionário", "strictly stationary":"estritamente estacionário",
  "weakly stationary":"fracamente estacionário", "stationarity":"estacionariedade", "strict stationarity":"estacionariedade estrita",
  "Markov chain":"cadeia de Markov", "Markov process":"processo de Markov", "Markov property":"propriedade de Markov",
  "memoryless property":"propriedade sem memória", "transition probability":"probabilidade de transição", "transition matrix":"matriz de transição",
  "transition kernel":"núcleo de transição", "state space":"espaço de estados", "state":"estado", "states":"estados",
  "initial state":"estado inicial", "initial distribution":"distribuição inicial", "absorbing state":"estado absorvente",
  "absorbing chain":"cadeia absorvente", "absorbing probability":"probabilidade de absorção", "communicating states":"estados comunicantes",
  "irreducible":"irredutível", "reducible":"redutível", "aperiodic":"aperiódica", "periodic":"periódica", "recurrent":"recorrente",
  "transient":"transiente", "positive recurrent":"recorrente positiva", "null recurrent":"recorrente nula", "stationary distribution":"distribuição estacionária",
  "invariant distribution":"distribuição invariante", "invariant measure":"medida invariante", "detailed balance":"balanço detalhado",
  "reversible":"reversível", "reversibility":"reversibilidade", "ergodic chain":"cadeia ergódica", "mixing":"mistura",
  "mixing time":"tempo de mistura", "coupling":"acoplamento", "coupling argument":"argumento de acoplamento", "coupling time":"tempo de acoplamento",
  "random walk":"passeio aleatório", "simple random walk":"passeio aleatório simples", "symmetric random walk":"passeio aleatório simétrico",
  "biased random walk":"passeio aleatório enviesado", "nearest-neighbor random walk":"passeio aleatório de vizinhos mais próximos",
  "gambler's ruin":"ruína do jogador", "gambler's ruin problem":"problema da ruína do jogador", "ruin probability":"probabilidade de ruína",
  "hitting probability":"probabilidade de atingimento", "return probability":"probabilidade de retorno", "return time":"tempo de retorno",
  "occupation time":"tempo de ocupação", "occupation measure":"medida de ocupação", "local time":"tempo local",
  "martingale":"martingal", "martingale difference":"diferença de martingal", "martingale property":"propriedade de martingal",
  "submartingale":"submartingal", "supermartingale":"supermartingal", "filtration":"filtração", "adapted":"adaptado(a)",
  "predictable":"previsível", "optional stopping":"parada opcional", "optional stopping theorem":"teorema da parada opcional",
  "Doob's inequality":"desigualdade de Doob", "Doob decomposition":"decomposição de Doob", "stopping time":"tempo de parada",
  "Brownian motion":"movimento browniano", "Wiener process":"processo de Wiener", "Brownian path":"trajetória browniana",
  "quadratic variation":"variação quadrática", "stochastic integral":"integral estocástica", "Ito integral":"integral de Itô",
  "Ito's formula":"fórmula de Itô", "stochastic differential equation":"equação diferencial estocástica", "diffusion":"difusão",
  "birth-death process":"processo de nascimento e morte", "Poisson process":"processo de Poisson", "counting process":"processo de contagem",
  "renewal process":"processo de renovação", "renewal theory":"teoria da renovação", "renewal equation":"equação de renovação",
  "branching process":"processo de ramificação", "Galton-Watson process":"processo de Galton-Watson", "extinction probability":"probabilidade de extinção",

  // Entropia, informação e dependência
  "entropy":"entropia", "Shannon entropy":"entropia de Shannon", "Rényi entropy":"entropia de Rényi", "Renyi entropy":"entropia de Rényi",
  "relative entropy":"entropia relativa", "Kullback-Leibler divergence":"divergência de Kullback-Leibler", "mutual information":"informação mútua",
  "conditional entropy":"entropia condicional", "information content":"conteúdo de informação", "cross-entropy":"entropia cruzada",
  "dependence":"dependência", "association":"associação", "positive dependence":"dependência positiva", "negative dependence":"dependência negativa",
  "uncorrelated":"não correlacionado", "correlated":"correlacionado", "decorrelation":"descorrelação", "autocorrelation":"autocorrelação",
  "autocovariance":"autocovariância", "correlation structure":"estrutura de correlação", "dependence structure":"estrutura de dependência",

  // Desigualdades e ferramentas clássicas
  "Markov inequality":"desigualdade de Markov", "Chebyshev inequality":"desigualdade de Chebyshev", "Jensen's inequality":"desigualdade de Jensen",
  "Jensen inequality":"desigualdade de Jensen", "Cauchy-Schwarz inequality":"desigualdade de Cauchy-Schwarz",
  "Hölder inequality":"desigualdade de Hölder", "Holder inequality":"desigualdade de Hölder", "Minkowski inequality":"desigualdade de Minkowski",
  "union bound":"cota da união", "Boole's inequality":"desigualdade de Boole", "Bonferroni inequality":"desigualdade de Bonferroni",
  "Paley-Zygmund inequality":"desigualdade de Paley-Zygmund", "Azuma-Hoeffding inequality":"desigualdade de Azuma-Hoeffding",
  "Hoeffding inequality":"desigualdade de Hoeffding", "Chernoff bound":"cota de Chernoff", "Chernoff inequality":"desigualdade de Chernoff",
  "concentration inequality":"desigualdade de concentração", "concentration of measure":"concentração de medida",
  "Borel-Cantelli lemma":"lema de Borel-Cantelli", "first Borel-Cantelli lemma":"primeiro lema de Borel-Cantelli",
  "second Borel-Cantelli lemma":"segundo lema de Borel-Cantelli", "zero-one law":"lei zero-um", "Kolmogorov zero-one law":"lei zero-um de Kolmogorov",
  "tail event":"evento de cauda", "tail sigma-algebra":"sigma-álgebra de cauda", "exchangeable sequence":"sequência intercambiável",

  // Paradoxos e probabilidade contraintuitiva — núcleo especial da IC
  "counterintuitive probability":"probabilidade contraintuitiva", "counterintuitive":"contraintuitivo(a)", "paradox":"paradoxo", "paradoxes":"paradoxos",
  "probability paradox":"paradoxo de probabilidade", "probability paradoxes":"paradoxos de probabilidade", "paradoxical":"paradoxal",
  "Monty Hall problem":"problema de Monty Hall", "Monty Hall paradox":"paradoxo de Monty Hall", "Bertrand's paradox":"paradoxo de Bertrand",
  "Bertrand paradox":"paradoxo de Bertrand", "birthday paradox":"paradoxo do aniversário", "Simpson's paradox":"paradoxo de Simpson",
  "Simpson paradox":"paradoxo de Simpson", "St. Petersburg paradox":"paradoxo de São Petersburgo", "Saint Petersburg paradox":"paradoxo de São Petersburgo",
  "St Petersburg paradox":"paradoxo de São Petersburgo", "boy or girl paradox":"paradoxo do menino ou menina",
  "two envelopes paradox":"paradoxo dos dois envelopes", "two-envelope paradox":"paradoxo dos dois envelopes",
  "inspection paradox":"paradoxo da inspeção", "waiting time paradox":"paradoxo do tempo de espera", "bus paradox":"paradoxo do ônibus",
  "friendship paradox":"paradoxo da amizade", "friendship paradoxes":"paradoxos da amizade", "false positive paradox":"paradoxo do falso positivo",
  "prosecutor's fallacy":"falácia do promotor", "inverse probability fallacy":"falácia da probabilidade inversa",
  "gambler's fallacy":"falácia do jogador", "hot-hand fallacy":"falácia da mão quente", "law of small numbers":"lei dos pequenos números",
  "regression to the mean":"regressão à média", "regression fallacy":"falácia da regressão", "base rate neglect":"negligência da taxa-base",
  "clustering illusion":"ilusão de agrupamento", "recency bias":"viés de recência", "selection bias":"viés de seleção",
  "survivorship bias":"viés de sobrevivência", "sampling bias":"viés de amostragem", "selection effect":"efeito de seleção",
  "conditioning effect":"efeito do condicionamento", "conditioning paradox":"paradoxo do condicionamento",
  "Borel paradox":"paradoxo de Borel", "Bertrand's box paradox":"paradoxo das caixas de Bertrand", "Joseph Bertrand":"Joseph Bertrand",
  "three prisoners problem":"problema dos três prisioneiros", "three prisoners paradox":"paradoxo dos três prisioneiros",
  "boy-girl paradox":"paradoxo do menino-menina", "boy girl paradox":"paradoxo do menino-menina",
  "nontransitive dice":"dados não transitivos", "non-transitive dice":"dados não transitivos", "nontransitive game":"jogo não transitivo",
  "non-transitive game":"jogo não transitivo", "intransitive dice":"dados intransitivos", "nontransitivity":"não transitividade",
  "randomness paradox":"paradoxo da aleatoriedade", "paradox of randomness":"paradoxo da aleatoriedade",
  "gambler's ruin":"ruína do jogador", "martingale betting system":"sistema de apostas martingale", "doubling strategy":"estratégia de dobramento",
  "martingale strategy":"estratégia martingale", "betting strategy":"estratégia de apostas", "gambling strategy":"estratégia de jogo",
  "fair betting strategy":"estratégia de apostas justa", "optional stopping paradox":"paradoxo da parada opcional",
  "infinite expectation":"esperança infinita", "infinite expected value":"valor esperado infinito", "finite expectation":"esperança finita",
  "heavy tail paradox":"paradoxo de cauda pesada", "rare event":"evento raro", "rare events":"eventos raros", "rare-event probability":"probabilidade de evento raro",
  "surprising probability":"probabilidade surpreendente", "unexpected outcome":"resultado inesperado", "counterexample":"contraexemplo",

  // Simulação e métodos computacionais em probabilidade
  "simulation":"simulação", "Monte Carlo simulation":"simulação de Monte Carlo", "Monte Carlo method":"método de Monte Carlo",
  "Monte Carlo estimate":"estimativa de Monte Carlo", "simulation study":"estudo de simulação", "simulated sample":"amostra simulada",
  "random number":"número aleatório", "random number generator":"gerador de números aleatórios", "pseudo-random":"pseudoaleatório",
  "pseudo-random number generator":"gerador de números pseudoaleatórios", "random seed":"semente aleatória", "replication":"replicação",
  "empirical probability":"probabilidade empírica", "empirical distribution":"distribuição empírica", "empirical frequency":"frequência empírica",
  "relative frequency":"frequência relativa", "observed frequency":"frequência observada", "law of averages":"lei das médias",
  "sample path":"trajetória amostral", "realization":"realização", "trajectory":"trajetória", "sample trajectory":"trajetória amostral",

  // Linguagem típica de artigos de probabilidade
  "assume that":"suponha que", "suppose that":"suponha que", "let":"seja / considere", "denote":"denote", "denotes":"denota",
  "let X be":"seja X", "for all":"para todo", "for every":"para todo", "there exists":"existe", "there exist":"existem",
  "almost every":"quase todo", "except on a null set":"exceto em um conjunto nulo", "with high probability":"com alta probabilidade",
  "with overwhelming probability":"com probabilidade esmagadoramente alta", "with probability tending to one":"com probabilidade tendendo a um",
  "with positive probability":"com probabilidade positiva", "with probability zero":"com probabilidade zero", "with probability less than":"com probabilidade menor que",
  "independent of":"independente de", "conditionally on":"condicionalmente a", "conditioned on":"condicionado a",
  "under the assumption":"sob a hipótese", "under suitable conditions":"sob condições adequadas", "under mild assumptions":"sob hipóteses brandas",
  "almost surely finite":"finito quase certamente", "finite almost surely":"finito quase certamente", "integrable":"integrável",
  "square integrable":"quadrado-integrável", "summable":"somável", "measurable":"mensurável", "measurability":"mensurabilidade",
  "integrability":"integrabilidade", "nonnegative":"não negativo", "nonnegative random variable":"variável aleatória não negativa",
  "positive random variable":"variável aleatória positiva", "bounded random variable":"variável aleatória limitada",
  "unbounded random variable":"variável aleatória ilimitada", "finite almost surely":"finito quase certamente",
  "in expectation":"em esperança", "on average":"em média", "on the average":"em média", "in the long run":"a longo prazo",
  "long-run behavior":"comportamento de longo prazo", "short-run behavior":"comportamento de curto prazo", "as n tends to infinity":"quando n tende a infinito",
  "asymptotically":"assintoticamente", "eventually":"eventualmente", "infinitely often":"infinitas vezes", "finitely often":"finitas vezes",
  "infinitely many times":"infinitas vezes", "almost never":"quase nunca", "typically":"tipicamente", "typically occurs":"ocorre tipicamente",
  "rarely":"raramente", "frequently":"frequentemente", "with probability approaching one":"com probabilidade tendendo a um",
  "expected waiting time":"tempo de espera esperado", "expected hitting time":"tempo esperado de atingimento",
  "expected number of trials":"número esperado de ensaios", "expected number of occurrences":"número esperado de ocorrências",
  "probability of occurrence":"probabilidade de ocorrência", "probability of hitting":"probabilidade de atingimento",
  "probability of return":"probabilidade de retorno", "probability of extinction":"probabilidade de extinção",
  "probability of survival":"probabilidade de sobrevivência", "survival probability":"probabilidade de sobrevivência",
  "extinction event":"evento de extinção", "survival event":"evento de sobrevivência", "failure probability":"probabilidade de falha",
  "success probability":"probabilidade de sucesso", "success event":"evento de sucesso", "failure event":"evento de falha"
});


const normalize=s=>s.toLowerCase().replace(/[“”‘’]/g,"'").replace(/\s+/g," ").trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
const stripPunct=s=>normalize(s).replace(/^[^a-zÀ-ÖØ-öø-ÿ0-9]+|[^a-zÀ-ÖØ-öø-ÿ0-9]+$/gi,"");
function local(text){const t=normalize(text);if(D[t])return {translation:D[t],math:true};return null}

let currentSelectionText="", currentSelectionRange=null, currentSelectionContext="";
let history=JSON.parse(localStorage.getItem("mathread_history_v5")||"[]");

$("pdfInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;page=1;currentFileName=f.name;$("welcome").classList.add("hidden");$("reader").classList.remove("hidden");["prev","next","minus","plus"].forEach(x=>$(x).disabled=false);await render();$("readerHint")?.classList.remove("hidden");toast("PDF aberto. Toque em uma palavra ou pressione e arraste para selecionar.")}catch(err){console.error(err);toast("Não foi possível abrir este PDF.")}};

async function render(){
  if(!pdf || rendering)return;
  rendering=true;
  const p=await pdf.getPage(page),vp=p.getViewport({scale});
  canvas.width=vp.width;canvas.height=vp.height;wrap.style.width=vp.width+"px";wrap.style.height=vp.height+"px";
  await p.render({canvasContext:ctx,viewport:vp}).promise;
  await renderText(p,vp);
  $("pageInfo").textContent=`${page} / ${pdf.numPages}`;
  $("zoom").textContent=Math.round(scale/1.25*100)+"%";
  $("prev").disabled=page<=1;
  $("next").disabled=page>=pdf.numPages;
  $("minus").disabled=scale<=.6;
  $("plus").disabled=scale>=2.5;
  clearSelectionUI();
  if(document.activeElement?.blur) document.activeElement.blur();
  window.getSelection()?.removeAllRanges();
  rendering=false;
}

async function renderText(p,vp){
  layer.innerHTML="";
  currentTextItems=[];
  const tc=await p.getTextContent();
  for(const item of tc.items){
    if(!item.str?.trim()) continue;
    const tx=pdfjsLib.Util.transform(vp.transform,item.transform);
    const fontSize=Math.max(6,Math.hypot(tx[2],tx[3]));
    const box=document.createElement("span");
    box.className="text-item";
    box.style.left=tx[4]+"px";
    box.style.top=(tx[5]-fontSize)+"px";
    box.style.fontSize=fontSize+"px";
    box.style.fontFamily=item.fontName||"sans-serif";
    box.style.width=Math.max(item.width*vp.scale,1)+"px";
    box.style.height=Math.max(fontSize*1.35,8)+"px";

    // Mantemos o texto real no DOM para que a seleção nativa do iPad funcione.
    // O texto fica invisível visualmente porque o PDF está desenhado no canvas.
    const parts=item.str.split(/(\s+|[.,;:!?()\[\]{}])/);
    for(const part of parts){
      if(!part) continue;
      const s=document.createElement("span");
      s.textContent=part;
      if(/\s+/.test(part)||/^[.,;:!?()\[\]{}]$/.test(part)){
        s.className="punct";
      }else{
        s.className="token";
        s.dataset.word=part;
        s.addEventListener("click",ev=>{
          // Nunca interromper a seleção nativa. Um clique simples sem seleção traduz a palavra.
          const selection=window.getSelection();
          if(selection && !selection.isCollapsed && selection.toString().trim()) return;
          if(Date.now()-lastPointerAt<250) return;
          ev.stopPropagation();
          handleToken(s,part,box);
        });
        s.addEventListener("pointerdown",ev=>{
          if(ev.pointerType==="mouse" && ev.button!==0) return;
          pointerInfo={x:ev.clientX,y:ev.clientY,time:Date.now(),word:part,el:s,box};
        },{passive:true});
        s.addEventListener("pointerup",ev=>{
          if(!pointerInfo) return;
          const info=pointerInfo; pointerInfo=null; lastPointerAt=Date.now();
          const moved=Math.hypot(ev.clientX-info.x,ev.clientY-info.y)>8;
          const elapsed=Date.now()-info.time;
          // Não usamos preventDefault: pressionar/arrastar fica inteiramente sob controle do iPad.
          if(!moved && elapsed<350){
            setTimeout(()=>{
              const sel=window.getSelection();
              if(!sel || sel.isCollapsed || !sel.toString().trim()) handleToken(info.el,info.word,info.box);
            },20);
          }
        },{passive:true});
      }
      box.appendChild(s);
    }
    layer.appendChild(box);
    currentTextItems.push({str:item.str,box});
  }
}

function nodeInTextLayer(node){
  const el=node?.nodeType===3?node.parentElement:node;
  return el?.closest?.(".text-layer");
}

function selectedTextHandler(){
  const sel=window.getSelection();
  if(!sel || sel.isCollapsed){ clearSelectionUI(); return; }
  if(!nodeInTextLayer(sel.anchorNode) || !nodeInTextLayer(sel.focusNode)) return;
  const text=sel.toString().replace(/\s+/g," ").trim();
  if(!text || text.length>1500){ clearSelectionUI(); return; }
  currentSelectionText=text;
  currentSelectionRange=sel.getRangeAt(0).cloneRange();
  currentSelectionContext=getSelectedContext(text);
  showSelectionAction(text,currentSelectionContext);
}

function getSelectedContext(text){
  // Contexto amplo e seguro: não depende de o início da seleção ser a primeira letra de um item.
  const hostA=currentSelectionRange?.startContainer?.parentElement?.closest?.('.text-item');
  const hostB=currentSelectionRange?.endContainer?.parentElement?.closest?.('.text-item');
  const candidates=[hostA?.textContent,hostB?.textContent].filter(Boolean);
  let base=candidates.join(' ').replace(/\s+/g,' ').trim();
  if(!base) base=text;
  const idx=base.toLowerCase().indexOf(text.toLowerCase());
  if(idx<0) return text;
  let start=idx,end=idx+text.length;
  while(start>0&&!/[.!?]/.test(base[start-1])) start--;
  while(end<base.length&&!/[.!?]/.test(base[end])) end++;
  return base.slice(start,end).trim().replace(/\s+/g," ");
}

function showSelectionAction(text,context){
 $("selectionBar").classList.remove("hidden");
 $("selectedPreview").textContent=text;
 $("translateSelection").onclick=()=>handlePhrase(text,context);
 $("explainSelection").onclick=()=>showPhraseExplanation(text,context);
}
function clearSelectionUI(){$("selectionBar").classList.add("hidden")}
async function handlePhrase(text,context){clearSelectionUI();showLoading(text,context,true);const result=await translatePhraseSmart(text,context);showPhraseResult(text,result,context)}
async function handleToken(el,word,box){currentToken=el;const clean=word.replace(/^[^A-Za-zÀ-ÖØ-öø-ÿ]+|[^A-Za-zÀ-ÖØ-öø-ÿ]+$/g,"");if(!clean)return;const ctxText=getContext(box,clean);showLoading(clean,ctxText,false);const result=await translateSmart(clean,ctxText);showResult(clean,result,ctxText)}
function getContext(box,word){let sentence=box.textContent||"";const idx=sentence.toLowerCase().indexOf(word.toLowerCase());if(idx<0)return sentence;let start=idx,end=idx+word.length;while(start>0&&!/[.!?]/.test(sentence[start-1]))start--;while(end<sentence.length&&!/[.!?]/.test(sentence[end]))end++;return sentence.slice(start,end).trim().replace(/\s+/g," ")}

function showLoading(word,context,phrase){$("drawer").classList.remove("hidden");$("drawerContent").innerHTML=`<div class="eyebrow">${phrase?"FRASE SELECIONADA":"PALAVRA"}</div><div class="term">${esc(word)}</div><div class="loading">⚡ Procurando a tradução…</div>`}
function findGlossaryPhrase(text){const exact=local(text);if(exact)return {...exact,source:"glossário matemático"};const words=normalize(text).split(/\s+/);for(let n=Math.min(8,words.length);n>=2;n--){for(let i=0;i<=words.length-n;i++){const ph=words.slice(i,i+n).join(" ");if(D[ph])return {translation:D[ph],math:true,source:"expressão matemática"}}}return null}
async function translateSmart(word,context){let r=findGlossaryPhrase(word);if(r)return r;try{const q=encodeURIComponent(word);const res=await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=en|pt-BR`);const data=await res.json();const tr=data?.responseData?.translatedText;if(tr)return {translation:tr,math:false,source:"tradução automática"}}catch(e){}return {translation:"Tradução não encontrada.",math:false,source:"indisponível"}}
async function translatePhraseSmart(text,context){let r=findGlossaryPhrase(text);if(r)return r;try{const q=encodeURIComponent(text);const res=await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=en|pt-BR`);const data=await res.json();const tr=data?.responseData?.translatedText;if(tr)return {translation:tr,math:false,source:"tradução automática"}}catch(e){}return {translation:"Tradução não encontrada.",math:false,source:"indisponível"}}
function mathDefinition(word){const k=normalize(word);const defs={
"convergence":"Comportamento em que uma sequência, série ou processo se aproxima de um limite segundo uma noção de convergência especificada.",
"measure":"Em teoria da medida, uma função que atribui um tamanho a conjuntos e é contavelmente aditiva em uma sigma-álgebra.",
"measurable":"Que é compatível com a estrutura de uma sigma-álgebra; por exemplo, uma função mensurável preserva a mensurabilidade das pré-imagens de conjuntos apropriados.",
"almost surely":"Propriedade que ocorre com probabilidade 1, embora possa falhar em um conjunto de probabilidade zero.",
"random variable":"Função mensurável que associa um valor numérico a cada resultado de um experimento aleatório.",
"eigenvalue":"Escalar λ para o qual existe vetor não nulo v satisfazendo Av = λv.",
"compact":"Espaço/conjunto que, em espaços métricos, pode ser caracterizado por ser completo e totalmente limitado; em geral, toda cobertura aberta admite subcobertura finita.",
"bounded":"Que está contido entre duas cotas finitas (no contexto apropriado).",
"injective":"Função em que entradas diferentes têm imagens diferentes.",
"surjective":"Função cuja imagem coincide com o contradomínio.",
"bijective":"Função simultaneamente injetiva e sobrejetiva; portanto possui inversa.",
"martingale":"Processo estocástico em que, sob as condições usuais, a esperança condicional futura é igual ao valor atual.",
"ergodic":"Propriedade de um sistema/processo que relaciona médias temporais e médias espaciais ou de conjunto, sob hipóteses apropriadas.",
"orbit":"Conjunto de estados obtidos ao iterar uma aplicação ou seguir a evolução de um sistema a partir de uma condição inicial."
};return defs[k]||null}
function showResult(word,result,context){const saved=vocab.some(x=>normalize(x.term)===normalize(word));const def=mathDefinition(word);saveHistory(word,result.translation,context);$("drawerContent").innerHTML=`<div class="eyebrow">PALAVRA</div><div class="term">${esc(word)}</div>${result.math?'<span class="badge">📐 Termo matemático</span>':''}<div class="translation">🇧🇷 ${esc(result.translation)}</div>${def?`<div class="definition"><b>📐 No contexto matemático</b><br>${esc(def)}</div>`:""}<div class="context"><b>Contexto:</b><br>${highlightContext(context,word)}</div><div class="note">Fonte: ${esc(result.source)}</div><div class="actions"><button id="save" class="save ${saved?"saved":""}">${saved?"✓ Salva":"⭐ Salvar"}</button><button id="speak" class="speak">🔊 Ouvir</button><button id="explain" class="explain">💡 Explicar</button></div>`;wireWordActions(word,result,context)}
function wireWordActions(word,result,context){$("save").onclick=()=>{if(!vocab.some(x=>normalize(x.term)===normalize(word))){vocab.push({term:word,translation:result.translation});localStorage.setItem("mathread_vocab_v5",JSON.stringify(vocab));$("save").textContent="✓ Salva";$("save").classList.add("saved");toast("Salvo no vocabulário ⭐")}};$("speak").onclick=()=>speakText(word);$("explain").onclick=()=>showExplanation(word,result.translation,context)}
function showPhraseResult(text,result,context){const saved=vocab.some(x=>normalize(x.term)===normalize(text));const def=mathDefinition(text);saveHistory(text,result.translation,context);$("drawerContent").innerHTML=`<div class="eyebrow">FRASE SELECIONADA</div><div class="phrase">${esc(text)}</div>${result.math?'<span class="badge">📐 Expressão matemática</span>':''}<div class="translation">🇧🇷 ${esc(result.translation)}</div>${def?`<div class="definition"><b>📐 Leitura matemática</b><br>${esc(def)}</div>`:""}<div class="context"><b>Contexto:</b><br>${highlightContext(context,text)}</div><div class="note">A tradução de frases é feita pela expressão completa quando disponível; caso contrário, usa tradução automática.</div><div class="actions"><button id="savePhrase" class="save ${saved?"saved":""}">${saved?"✓ Salva":"⭐ Salvar frase"}</button><button id="speakPhrase" class="speak">🔊 Ouvir</button><button id="explainPhrase" class="explain">💡 Explicar</button></div>`;$("savePhrase").onclick=()=>{if(!vocab.some(x=>normalize(x.term)===normalize(text))){vocab.push({term:text,translation:result.translation,type:"phrase"});localStorage.setItem("mathread_vocab_v5",JSON.stringify(vocab));$("savePhrase").textContent="✓ Salva";$("savePhrase").classList.add("saved");toast("Frase salva no vocabulário ⭐")}};$("speakPhrase").onclick=()=>speakText(text);$("explainPhrase").onclick=()=>showPhraseExplanation(text,context)}
function showExplanation(word,translation,context){const def=mathDefinition(word);$("drawerContent").innerHTML=`<div class="eyebrow">EXPLICAÇÃO</div><div class="term">${esc(word)}</div><div class="translation">🇧🇷 ${esc(translation)}</div>${def?`<div class="definition"><b>📐 Conceito matemático</b><br>${esc(def)}</div>`:`<div class="definition"><b>🧠 Como ler no artigo</b><br>Observe o que o termo modifica, quais hipóteses aparecem perto dele e qual objeto matemático está sendo discutido. O contexto é essencial para escolher a tradução correta.</div>`}<div class="context"><b>Trecho:</b><br>${highlightContext(context,word)}</div><button id="back" class="explain">← Voltar</button>`;$("back").onclick=()=>showResult(word,{translation,math:!!local(word),source:"glossário matemático"},context)}
function showPhraseExplanation(text,context){const r=findGlossaryPhrase(text);$("drawer").classList.remove("hidden");$("drawerContent").innerHTML=`<div class="eyebrow">EXPLICAÇÃO DA FRASE</div><div class="phrase">${esc(text)}</div><div class="definition"><b>🧠 Como estudar</b><br>Leia a frase inteira antes de traduzir palavra por palavra. Identifique o objeto matemático, as hipóteses e a relação lógica (por exemplo: implica, se e somente se, existe, para todo).${r?.math?`<br><br><b>📐 Expressão reconhecida:</b> ${esc(r.translation)}`:""}</div><div class="context"><b>Contexto:</b><br>${esc(context)}</div><button id="backPhrase" class="explain">← Voltar</button>`;$("backPhrase").onclick=()=>handlePhrase(text,context)}
function highlightContext(context,word){const re=new RegExp("("+String(word).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");return esc(context).replace(re,"<b>$1</b>")}
function speakText(text){if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";speechSynthesis.speak(u)}else toast("Seu navegador não oferece leitura em voz alta.")}
function saveHistory(term,translation,context){history.unshift({term,translation,context,time:Date.now()});history=history.slice(0,30);localStorage.setItem("mathread_history_v5",JSON.stringify(history))}

document.addEventListener("selectionchange",()=>requestAnimationFrame(selectedTextHandler));
$("prev").addEventListener("click",async()=>{if(pdf&&page>1&&!rendering){page--;await render()}});
$("next").addEventListener("click",async()=>{if(pdf&&page<pdf.numPages&&!rendering){page++;await render()}});
$("plus").addEventListener("click",async()=>{if(pdf&&!rendering){scale=Math.min(2.5,Math.round((scale+.15)*100)/100);await render()}});
$("minus").addEventListener("click",async()=>{if(pdf&&!rendering){scale=Math.max(.6,Math.round((scale-.15)*100)/100);await render()}});
$("close").addEventListener("click",ev=>{ev.preventDefault();ev.stopPropagation();$("drawer").classList.add("hidden");clearSelectionUI();window.getSelection()?.removeAllRanges()});
["prev","next","plus","minus","close","history","vocab"].forEach(id=>$(id)?.addEventListener("pointerdown",ev=>ev.stopPropagation(),{passive:true}));
$("vocab").onclick=()=>{$("drawer").classList.remove("hidden");if(!vocab.length){$("drawerContent").innerHTML='<div class="eyebrow">ESTUDO</div><h2>⭐ Vocabulário</h2><p class="empty">Você ainda não salvou nenhuma palavra ou frase.</p>';return}$("drawerContent").innerHTML='<div class="eyebrow">ESTUDO</div><h2>⭐ Vocabulário</h2>'+vocab.map((x,i)=>`<div class="vrow"><button class="remove" data-i="${i}">×</button><div class="vword">${esc(x.term)}</div><div class="vtrans">🇧🇷 ${esc(x.translation)}</div></div>`).join("");document.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{vocab.splice(+b.dataset.i,1);localStorage.setItem("mathread_vocab_v5",JSON.stringify(vocab));$("vocab").click()})};
$("history").onclick=()=>{$("drawer").classList.remove("hidden");if(!history.length){$("drawerContent").innerHTML='<div class="eyebrow">HISTÓRICO</div><h2>🕘 Histórico</h2><p class="empty">Nenhuma consulta ainda.</p>';return}$("drawerContent").innerHTML='<div class="eyebrow">HISTÓRICO</div><h2>🕘 Últimas consultas</h2>'+history.map(x=>`<div class="vrow historyRow"><div></div><div class="vword">${esc(x.term)}</div><div class="vtrans">🇧🇷 ${esc(x.translation)}</div></div>`).join("")};
function toast(t){$("toast").textContent=t;$("toast").style.display="block";clearTimeout(window.__toast);window.__toast=setTimeout(()=>$("toast").style.display="none",2200)}

// Atalhos úteis no teclado/computador e acessibilidade dos controles.
document.addEventListener("keydown",async e=>{
  if(!pdf || rendering) return;
  if(e.key==="ArrowLeft" && page>1){page--;await render();}
  else if(e.key==="ArrowRight" && page<pdf.numPages){page++;await render();}
  else if((e.key==="+"||e.key==="=")&&!e.metaKey&&!e.ctrlKey){scale=Math.min(2.5,Math.round((scale+.15)*100)/100);await render();}
  else if(e.key==="-"&&!e.metaKey&&!e.ctrlKey){scale=Math.max(.6,Math.round((scale-.15)*100)/100);await render();}
});

if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
