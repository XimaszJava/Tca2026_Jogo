// =====================================================
// CLASSES
// =====================================================
 
// Modelo de um minério que pode ser encontrado na mina
class Minerio {
  constructor(nome, raridade, valor, peso, profundidadeMinima, nivelExigido) {
    this.nome = nome;
    this.raridade = raridade;
    this.valor = valor;                       // quanto vale ao vender
    this.peso = peso;                         // chance base de aparecer (RNG)
    this.profundidadeMinima = profundidadeMinima;
    this.nivelExigido = nivelExigido;         // nível de picareta necessário
  }
}
 
// Modelo de uma picareta (com sistema de durabilidade)
class Picareta {
  constructor(nivel, nome, durabilidadeMax, custo) {
    this.nivel = nivel;
    this.nome = nome;
    this.durabilidadeMax = durabilidadeMax;
    this.durabilidade = durabilidadeMax;
    this.custo = custo;
  }
 
  gastar() {
    this.durabilidade--;
  }
 
  estaQuebrada() {
    return this.durabilidade <= 0;
  }
 
  custoReparo() {
    let falta = this.durabilidadeMax - this.durabilidade;
    return Math.ceil(falta * 0.5 * (this.nivel + 1));
  }
 
  reparar() {
    this.durabilidade = this.durabilidadeMax;
  }
}
 
// A família que o mineiro precisa sustentar
class Familia {
  constructor(membros) {
    this.membros = membros;
    this.diasSemComer = 0;
  }
 
  custoPorDia() {
    return this.membros * 4;
  }
}
 
// O jogador (o mineiro)
class Jogador {
  constructor(nome) {
    this.nome = nome;
    this.dinheiro = 20;
    this.profundidade = 0;
    this.picadas = 0;
    this.dia = 1;
    this.mortes = 0;
    this.casa = 0;                       // posição no array CASAS
    this.vivo = true;
    this.familia = new Familia(4);
    this.picareta = criarPicareta(0);    // começa com a de madeira
    this.inventario = [];                // array de objetos Minerio
  }
 
  guardar(minerio) {
    this.inventario.push(minerio);
  }
 
  valorInventario() {
    let total = 0;
    for (let minerio of this.inventario) {
      total += minerio.valor;
    }
    return total;
  }
 
  esvaziarInventario() {
    this.inventario = [];
  }
}

// Arrays do game
 
// Detalhes sobre cada minério
const MINERIOS = [
  new Minerio("Pedra",    "Comum",    1,    60,  0,  0),
  new Minerio("Carvão",   "Comum",    3,    25,  0,  0),
  new Minerio("Ferro",    "Incomum",  8,    12,  5,  1),
  new Minerio("Prata",    "Raro",     25,   6,   15, 2),
  new Minerio("Ouro",     "Épico",    80,   3,   30, 2),
  new Minerio("Rubi",     "Lendário", 250,  1.2, 50, 3),
  new Minerio("Diamante", "Mítico",   1000, 0.4, 80, 4),
];
 
// nome, durabilidade, custo
const DADOS_PICARETAS = [
  ["Madeira", 40, 0],
  ["Pedra", 80, 50],
  ["Ferro", 150, 250],
  ["Aço", 300, 1000],
  ["Diamante", 600, 5000],
];
 
function criarPicareta(nivel) {
  let d = DADOS_PICARETAS[nivel];
  return new Picareta(nivel, d[0], d[1], d[2]);
}
 

const CASAS = [
  { nome: "Barraco de lona", custo: 0 },
  { nome: "Casa de madeira", custo: 800 },
  { nome: "Casa de tijolos", custo: 4000 },
  { nome: "Casa na colina", custo: 20000 },   // final do jogo
];
 
// Perigos(Formas de game over/Perigo)
const PERIGOS = [
  {
    nome: "Lava",
    profundidadeMinima: 10,
    mortal: true,
    mensagem: "💀 Você cavou direto numa bolsa de LAVA...",
    chance(prof) { return Math.min(0.005 + prof * 0.0004, 0.06); },
  },
  {
    nome: "Topeira gigante",
    profundidadeMinima: 20,
    mortal: true,
    mensagem: "☠️ Uma TOPEIRA GIGANTE surgiu da escuridão e te engoliu inteiro!",
    chance(prof) { return Math.min(0.004 + prof * 0.0003, 0.05); },
  },
  {
    nome: "Desabamento",
    profundidadeMinima: 5,
    mortal: false,
    mensagem: "💥 Desabamento! Você escapou, mas a picareta tomou dano (-10).",
    chance(prof) { return 0.015; },
  },
];
 
const PICADAS_POR_DIA = 10;