class Espaco {
  constructor(espacoName, capacity, availability, user) {
    this.espaco_nome = espacoName;
    this.capacidade = capacity;
    this.horarios_disponiveis = availability;
    this.usuario = user;
  }
}

module.exports = Espaco;