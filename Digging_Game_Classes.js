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