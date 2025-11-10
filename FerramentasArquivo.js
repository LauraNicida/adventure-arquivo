import { Ferramenta } from "./Basicas.js";
import { validate } from "bycontract";

// Ferramentas com usos/cargas — usar() retorna boolean.

// EPI: luvas de algodão (infinito, mas precisamos "marcar" que a pessoa vestiu)
export class LuvasAlgodao extends Ferramenta {
  constructor(){ super("luvas"); }
  usar(){ return true; }
}

// Desumidificador portátil — simula “energia/uso” limitado (2 usos)
export class DesumidificadorPortatil extends Ferramenta {
  #usos;
  constructor(){
    super("desumidificador");
    this.#usos = 2;
  }
  usar(){
    if(this.#usos <= 0) return false;
    this.#usos -= 1;
    return true;
  }
}

// Cartão RFID — 3 leituras (cargas)
export class CartaoRFID extends Ferramenta {
  #cargas;
  constructor(){
    super("cartao");
    this.#cargas = 3;
  }
  usar(){
    if(this.#cargas <= 0) return false;
    this.#cargas -= 1;
    return true;
  }
}

// Solução anti-mofo — descartável (1 uso)
export class SolucaoAntimofo extends Ferramenta {
  #usos;
  constructor(){
    super("antimofo");
    this.#usos = 1;
  }
  usar(){
    if(this.#usos <= 0) return false;
    this.#usos -= 1;
    return true;
  }
}
