import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { DesumidificadorPortatil, CartaoRFID, SolucaoAntimofo } from "./FerramentasArquivo.js";

// Objetos mudam de estado quando "usar(ferramenta)" retorna true.

export class PainelClimatizacao extends Objeto {
  constructor(engine){
    super("painel_climatizacao",
      "Climatização desligada. Umidade subindo :(",
      "Climatização religada. UFA! Ar seco e estável."
    );
    this.engine = engine;
  }
  usar(ferramenta){
    validate(ferramenta,Ferramenta);
    if (ferramenta instanceof DesumidificadorPortatil && ferramenta.usar()){
      this.acaoOk = true;
      this.engine.estado.climaLigado = true;
      return true;
    }
    return false;
  }
}

export class EstanteMovel extends Objeto {
  constructor(engine){
    super("estante_movel",
      "Estante compactadora travada (precisa de autenticação).",
      "Estante destravada e recuada. Acesso ao cofre liberado."
    );
    this.engine = engine;
  }
  usar(ferramenta){
    validate(ferramenta,Ferramenta);
    if (ferramenta instanceof CartaoRFID && ferramenta.usar()){
      if (this.engine.estado.terminalOK){
        this.acaoOk = true;
        return true;
      }
    }
    return false;
  }
}

export class TerminalCatalogacao extends Objeto {
  constructor(engine){
    super("terminal_catalogacao",
      "Terminal exige EPI e cartão válido para autenticar.",
      "Terminal autenticado. Procedimentos liberados."
    );
    this.engine = engine;
  }
  usar(ferramenta){
    validate(ferramenta,Ferramenta);
    const luvasOk = this.engine.estado.usaLuvas === true;
    if (!luvasOk) return false;
    if (ferramenta instanceof CartaoRFID && ferramenta.usar()){
      this.acaoOk = true;
      this.engine.estado.terminalOK = true;
      return true;
    }
    return false;
  }
}

export class CofreDeNegativos extends Objeto {
  constructor(engine){
    super("cofre_negativos",
      "Cofre de negativos: sinais de fungo. Exige EPI e acesso liberado.",
      "Cofre estabilizado e negativos salvos. Patrimônio preservado!"
    );
    this.engine = engine;
  }
  usar(ferramenta){
    validate(ferramenta,Ferramenta);
    const luvasOk = this.engine.estado.usaLuvas === true;
    const climaOk = this.engine.estado.climaLigado === true;
    const termOk  = this.engine.estado.terminalOK === true;
    if (!luvasOk || !climaOk || !termOk) return false;

    if (ferramenta instanceof SolucaoAntimofo && ferramenta.usar()){
      this.acaoOk = true;
      this.engine.indicaFimDeJogo(); // vitória
      return true;
    }
    return false;
  }
}
