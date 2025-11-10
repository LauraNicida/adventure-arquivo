// EngineMenu.js
import promptSync from "prompt-sync";
import { Engine } from "./Basicas.js";

const prompt = promptSync({ sigint:true });

/**
 * Engine de interface “menu numerado”.
 * - Não altera Basicas.js
 * - Apenas substitui o loop do jogo para apresentar opções numeradas
 */
export class EngineMenu extends Engine {
  joga(){
    let fim = false;

    while(!fim){
      console.log("-------------------------");
      // Descrição básica da sala atual
      const sala = this.salaCorrente;
      console.log(`Você está na ${sala.nome}`);

      // Listas com nomes
      const portas = Array.from(sala.portas.keys());
      const ferramentasSala = Array.from(sala.ferramentas.keys());
      const objetosSala = Array.from(sala.objetos.keys());
      const inventario = this.mochila.inventario()
        .split(",")
        .map(s=>s.trim())
        .filter(Boolean);

      if (objetosSala.length)  console.log("Objetos:", objetosSala.join(", "));
      else                     console.log("Não há objetos na sala.");
      if (ferramentasSala.length) console.log("Ferramentas:", ferramentasSala.join(", "));
      console.log("Portas:", portas.join(", "));
      console.log();

      // Monta opções
      const opts = [];

      // Ir para salas
      for(const p of portas){
        opts.push({
          label:`Ir para: ${p}`,
          run: ()=> {
            const prox = sala.portas.get(p);
            if (prox) this.salaCorrente = prox;
          }
        });
      }

      // Pegar ferramentas
      for(const f of ferramentasSala){
        opts.push({
          label:`Pegar: ${f}`,
          run: ()=> {
            const ferr = sala.ferramentas.get(f);
            if (ferr){
              this.mochila.guarda(ferr);
              sala.ferramentas.delete(f);
              console.log(`Ok! ${f} guardado no inventário.`);
            } else {
              console.log("Não encontrei essa ferramenta aqui.");
            }
          }
        });
      }

      // Usar combinações (inventário x objetos da sala)
      for(const f of inventario){
        for(const o of objetosSala){
          opts.push({
            label:`Usar ${f} em ${o}`,
            run: ()=> {
              const ok = sala.usa(f,o);
              console.log(ok ? "Feito!" : `Não rolou usar ${f} em ${o} aqui.`);
            }
          });
        }
      }

      // Ver inventário
      opts.push({
        label:"Ver inventário",
        run: ()=> {
          console.log("Inventário:", this.mochila.inventario() || "(vazio)");
        }
      });

      // Encerrar
      opts.push({
        label:"Encerrar jogo",
        run: ()=> { fim = true; }
      });

      // Exibe menu
      console.log("O que deseja fazer?");
      opts.forEach((op, i)=> console.log(`${i+1}) ${op.label}`));

      const escolha = Number(prompt("Digite o número da ação: ").trim());
      const idx = escolha - 1;

      if (!Number.isInteger(idx) || idx < 0 || idx >= opts.length){
        console.log("Opção inválida. Tenta de novo 😉\n");
        continue;
      }

      // Executa ação
      opts[idx].run?.();
      console.log();
    }

    console.log("Jogo encerrado!");
  }
}
