/// <reference types="cypress"/>
const el = require('../support/elementos').ELEMENTS;
let tamanhoAtualLista;
let tarefaCadastrada;
const tituloValido240 = Cypress._.repeat('1', 240);
const mensagemAlertCadastrada = 'Tarefa cadastrada com sucesso';
const mensagemAlertExcluida = 'Tarefa excluída com sucesso';

function existeLista(){
    cy.get('body').then($body=>{
        if($body.find(el.listaDeTarefas).length){
            cy.get(el.listaDeTarefas).then($lista =>{
                tamanhoAtualLista = $lista.length;
                tarefaCadastrada = tamanhoAtualLista + 1;
            });
        }else if(cy.get(el.listaDeTarefas).should('not.exist')){
            tamanhoAtualLista = 0;
            tarefaCadastrada = tamanhoAtualLista + 1;
        }
    }
    );
}

function reverse($str){
    return $str.split("-").reverse().join("-");
}

beforeEach(()=>{
    /*
    O usuario: user, senha: abcdefgh. Deve ser criado antes de executar os testes!
    cy.criarUsuario();
    */
    cy.logar();
    cy.wait(500);
    existeLista();
    cy.get(el.cadastrarNovaTarefa).click();
})

describe('Validação do titulo',()=>{
    it('Titulo válido', ()=>{
        cy.fixture('dadosTeste').then((dados)=>{
            dados.forEach(dado=>{
                cy.escreveTitulo(dado.titulo);
                cy.get(el.cadastrar).click();
                cy.validar(tarefaCadastrada);
                cy.get(el.ultimaCadastradaTitulo).should('contain', dado.titulo);
                cy.get(el.cadastrarNovaTarefa).click();
                tarefaCadastrada++;
            })
        })
    })
    it('Titulo com 240 caracteres', ()=>{
        cy.escreveTitulo(tituloValido240);
        cy.get(el.cadastrar).click();
        cy.validar(tarefaCadastrada);
        cy.get(el.ultimaCadastradaTitulo).should('contain', tituloValido240);
    })
    it('Titulo menor de 8 caracteres', ()=>{
        cy.fixture('dadosTeste').then((dados)=>{
            dados.forEach(dado=>{
                cy.escreveTitulo(dado.tituloInvalido);
                cy.get(el.cadastrar).click();
                cy.get(el.cadastrarNovaTarefa).click();
            })
        })
        cy.validar(tamanhoAtualLista);
    })
})

describe('Validação de data', ()=>{
    it('Data válida', ()=>{
        cy.fixture('dadosTeste').then((dados)=>{
            dados.forEach(dado=>{
                cy.escreveTituloEData(dado.titulo, dado.data);
                cy.get(el.cadastrar).click();
                cy.validar(tarefaCadastrada);
                cy.get(el.ultimaCadastradaTitulo).should('contain', dado.titulo);
                cy.get(el.ultimaCadastradaData).should('contain', reverse(dado.data));
                cy.get(el.cadastrarNovaTarefa).click();
                tarefaCadastrada++;
            })
        })
    })
    it('Data inválida', ()=>{
        cy.fixture('dadosTeste').then((dados)=>{
            dados.forEach(dado=>{
                cy.escreveTituloEData(dado.tituloInvalido, dado.dataInvalida);
                cy.get(el.cadastrar).click();
                cy.validar(tamanhoAtualLista);
                cy.get(el.cadastrarNovaTarefa).click();
            })
        })
    })
})

describe('Validação alerta "Tarefa cadastrada com sucesso"', ()=>{
    it('Recebe alerta', ()=>{
        cy.fixture('dadosTeste').then((dado)=>{
                cy.escreveTituloEData(dado[1].titulo, dado[1].data);
                cy.get(el.cadastrar).click().then(()=>{
                    cy.window().then(($win)=>{
                        /*
                        Trecho de código utilizado para reproduzir o alert
                        cy.criaAlert(mensagemAlertCadastrada);
                        */
                        cy.stub($win, 'alert').as('alert') ;
                    })
                });
                cy.validaAlert(mensagemAlertCadastrada);
                cy.validar(tarefaCadastrada);
                cy.get(el.ultimaCadastradaTitulo).should('contain', dado[1].titulo);
                cy.get(el.ultimaCadastradaData).should('contain', reverse(dado[1].data));
        })
    })
})
describe('Validação alerta "Tarefa excluída com sucesso"', ()=>{
    it('Recebe alerta', ()=>{
        cy.fixture('dadosTeste').then((dado)=>{
                cy.escreveTituloEData(dado[1].titulo, dado[1].data);
                cy.get(el.cadastrar).click();
                cy.validar(tarefaCadastrada);
                cy.get(el.ultimaCadastradaTitulo).should('contain', dado[1].titulo);
                cy.get(el.ultimaCadastradaData).should('contain', reverse(dado[1].data));
                cy.get(':nth-child(1) > .inner-task > .sc-iBPTik > .excluir').click().then(()=>{
                    cy.window().then(($win)=>{
                        /*
                        Trecho de código utilizado para reproduzir o alert
                        cy.criaAlert(mensagemAlertExcluida);
                        */
                        cy.stub($win, 'alert').as('alert') ;
                    })
                })
                cy.validaAlert(mensagemAlertExcluida);
                cy.validar(tamanhoAtualLista);
        })
    })
})
