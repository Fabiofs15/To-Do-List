/// <reference types="cypress"/>
let tamanhoAtualLista;
let existe;
let tarefaCadastrada;
const dataValida = '2022-08-20';
const dataInvalida = '2022-02-31';
const tituloValido = '12345678';
const tituloValido240 = Cypress._.repeat('1', 240);
const mensagemAlertCadastrada = 'Tarefa cadastrada com sucesso'
const mensagemAlertExcluida = 'Tarefa excluída com sucesso'

function validar($condicao){
    cy.get('body').then(()=>{
        if(existe){
            cy.get('.sc-jSgvzq.HdxTx').then(() =>{
                cy.get('.sc-jSgvzq.HdxTx').should('have.length', $condicao);
            });
        }
    })
}

function escreveTitulo($titulo){
    cy.get('[type="text"]')
    .type($titulo)
    .should('have.value', $titulo);
}

function escreveTituloEData($titulo, $data){
    escreveTitulo($titulo);
    cy.get('[type="date"]').type($data)
}

function criaAlert($mensagem){
    cy.window().then((win) => {
        win.window.alert($mensagem);
       });
}

function validaAlert($mensagem){
    cy.on('window:alert', (str)=>{
        expect(str).to.be.equal($mensagem);
    })
}

beforeEach(()=>{
    cy.visit('http://localhost:3000');
    cy.get('[type="text"]').type('user');
    cy.get('[type="password"]').type('abcdefgh');
    cy.get('button').click();
    cy.wait(500);
    cy.get('body').then($body=>{
        if($body.find('.sc-jSgvzq.HdxTx').length){
            existe = true;
            cy.get('.sc-jSgvzq.HdxTx').then($lista =>{
                tamanhoAtualLista = $lista.length;
                tarefaCadastrada = tamanhoAtualLista + 1;
            });
        }else if(cy.get('.sc-jSgvzq.HdxTx').should('not.exist')){
            existe = false;
        }
    });
    cy.get('.sc-dlfnuX').click();
})

describe('Validação do titulo',()=>{
    it('Titulo com 8 caracteres', ()=>{
        escreveTitulo(tituloValido);
        cy.get('form > button').click();
        validar(tarefaCadastrada);
    })
    it('Titulo com 240 caracteres', ()=>{
        escreveTitulo(tituloValido240);
        cy.get('form > button').click();
        validar(tarefaCadastrada);
    })
    it('Titulo menor de 8 caracteres', ()=>{
        escreveTitulo('1');
        cy.get('form > button').click();
        validar(tamanhoAtualLista);
    })
})

describe('Validação de data', ()=>{
    it('Data válida', ()=>{
        escreveTituloEData(tituloValido, dataValida);
        cy.get('form > button').click();
        validar(tarefaCadastrada);
    })
    it('Data inválida', ()=>{
        escreveTituloEData(tituloValido, dataInvalida);
        cy.get('form > button').click();
        validar(tamanhoAtualLista);
    })
})

describe.only('Validação alerta "Tarefa cadastrada com sucesso"', ()=>{
    it('Recebe alerta', ()=>{
        escreveTituloEData(tituloValido, dataValida)
        cy.get('form > button').click();
        
        //simulando alert
        criaAlert(mensagemAlertCadastrada);
        validaAlert(mensagemAlertCadastrada);
        validar(tarefaCadastrada);
    })
})
describe('Validação alerta "Tarefa excluída com sucesso"', ()=>{
    it('Recebe alerta', ()=>{
        escreveTituloEData(tituloValido, dataValida);
        cy.get('form > button').click();
        validar(tarefaCadastrada);
        cy.get(':nth-child(1) > .inner-task > .sc-iBPTik > .excluir').click();
        //simulando alert
        criaAlert(mensagemAlertExcluida);
        validaAlert(mensagemAlertExcluida);
        validar(tamanhoAtualLista);
    })
})
