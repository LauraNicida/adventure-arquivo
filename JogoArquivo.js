import { Engine } from "./Basicas.js";
import { Recepcao, Corredor, SalaClimatizacao, Deposito, Catalogacao, ArquivoCentral } from "./SalasArquivo.js";

export class JogoArquivo extends Engine {
  constructor(){
    super();
    this.estado = { usaLuvas:false, climaLigado:false, terminalOK:false };
  }
  criaCenario(){
    const recepcao = new Recepcao(this);
    const corredor = new Corredor(this);
    const clima = new SalaClimatizacao(this);
    const deposito = new Deposito(this);
    const cata = new Catalogacao(this);
    const arquivo = new ArquivoCentral(this);

    recepcao.portas.set(corredor.nome, corredor);
    corredor.portas.set(recepcao.nome, recepcao);
    corredor.portas.set(clima.nome, clima);
    corredor.portas.set(deposito.nome, deposito);
    corredor.portas.set(cata.nome, cata);
    corredor.portas.set(arquivo.nome, arquivo);
    clima.portas.set(corredor.nome, corredor);
    deposito.portas.set(corredor.nome, corredor);
    cata.portas.set(corredor.nome, corredor);
    arquivo.portas.set(corredor.nome, corredor);

    this.salaCorrente = recepcao;
  }
}
