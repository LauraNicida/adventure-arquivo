import { validate } from "bycontract";
import { Sala, Engine } from "./Basicas.js";
import { LuvasAlgodao, DesumidificadorPortatil, CartaoRFID, SolucaoAntimofo } from "./FerramentasArquivo.js";
import { PainelClimatizacao, EstanteMovel, TerminalCatalogacao, CofreDeNegativos, Higrometro, SensorDePorta } from "./ObjetosArquivo.js";

// Cada sala anuncia objetos/ferramentas no construtor.
// Sala.usa(ferramenta,objeto) busca na mochila e delega para obj.usar().

export class Recepcao extends Sala {
  constructor(engine){
    validate(engine,Engine);
    super("Recepcao", engine);
    const luvas = new LuvasAlgodao();
    this.ferramentas.set(luvas.nome, luvas);
  }
  usa(ferramenta,objeto){
    validate(arguments,["String","String"]);
    // Vestir luvas: marca estado global
    if (ferramenta === "luvas"){
      this.engine.estado.usaLuvas = true;
      return true;
    }
    return false;
  }
}

export class Corredor extends Sala {
  constructor(engine){
    validate(engine,Engine);
    super("Corredor", engine);
    const hig = new Higrometro(engine);
    this.objetos.set(hig.nome, hig);
  }
  usa(ferramenta,objeto){
    validate(arguments,["String","String"]);
    if (!this.engine.mochila.tem(ferramenta)) return false;
    if (!this.objetos.has(objeto)) return false;
    const obj = this.objetos.get(objeto);
    return obj.usar(this.engine.mochila.pega(ferramenta));
  }
}

export class SalaClimatizacao extends Sala {
  constructor(engine){
    validate(engine,Engine);
    super("SalaClimatizacao", engine);
    const painel = new PainelClimatizacao(engine);
    this.objetos.set(painel.nome, painel);
  }
  usa(ferramenta,objeto){
    validate(arguments,["String","String"]);
    if (!this.engine.mochila.tem(ferramenta)) return false;
    if (!this.objetos.has(objeto)) return false;
    const obj = this.objetos.get(objeto);
    return obj.usar(this.engine.mochila.pega(ferramenta));
  }
}

export class Deposito extends Sala {
  constructor(engine){
    validate(engine,Engine);
    super("Deposito", engine);
    const desumid = new DesumidificadorPortatil();
    this.ferramentas.set(desumid.nome, desumid);
  }
  usa(ferramenta,objeto){
    validate(arguments,["String","String"]);
    return false;
  }
}

export class Catalogacao extends Sala {
  constructor(engine){
    validate(engine,Engine);
    super("Catalogacao", engine);
    const cartao = new CartaoRFID();
    this.ferramentas.set(cartao.nome, cartao);
    const term = new TerminalCatalogacao(engine);
    this.objetos.set(term.nome, term);
  }
  usa(ferramenta,objeto){
    validate(arguments,["String","String"]);
    if (!this.engine.mochila.tem(ferramenta)) return false;
    if (!this.objetos.has(objeto)) return false;
    const obj = this.objetos.get(objeto);
    return obj.usar(this.engine.mochila.pega(ferramenta));
  }
}

export class ArquivoCentral extends Sala {
  constructor(engine){
    validate(engine,Engine);
    super("ArquivoCentral", engine);
    const est = new EstanteMovel(engine);
    const cofre = new CofreDeNegativos(engine);
    const sensor = new SensorDePorta(engine);
    this.objetos.set(est.nome, est);
    this.objetos.set(cofre.nome, cofre);
    this.objetos.set(sensor.nome, sensor);
    const ant = new SolucaoAntimofo();
    this.ferramentas.set(ant.nome, ant);
  }
  usa(ferramenta,objeto){
    validate(arguments,["String","String"]);
    if (!this.engine.mochila.tem(ferramenta)) return false;
    if (!this.objetos.has(objeto)) return false;
    const obj = this.objetos.get(objeto);
    return obj.usar(this.engine.mochila.pega(ferramenta));
  }
}
