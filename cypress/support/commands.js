const el = require('./elementos').ELEMENTS;
const username = 'user';
const password = 'abcdefgh';
//O usuario: user, senha: abcdefgh. Deve ser criado antes de executar os testes!
Cypress.Commands.add('criarUsuario',()=>{
    cy.visit('http://localhost:3000');
        cy.get('a').click()
        cy.get('[maxlength="64"]').type(username);
        cy.get('[maxlength="30"]').type(username);
        cy.get('[type="formPassword"]').type(password);
        cy.get('button').click();
})

Cypress.Commands.add('logar', ()=>{
    cy.visit('http://localhost:3000');
    cy.get(el.userLogin).type(username);
    cy.get(el.userSenha).type(password);
    cy.get(el.botaoLogar).click();
})

Cypress.Commands.add('escreveTitulo', ($titulo)=>{
    cy.get(el.inputTitulo)
    .type($titulo)
    .should('have.value', $titulo);
})

Cypress.Commands.add('escreveTituloEData', ($titulo, $data)=>{
    cy.escreveTitulo($titulo);
    cy.get(el.inputData).type($data)
})

Cypress.Commands.add('criaAlert', ($mensagem)=>{
    cy.window().then((win) => {
        win.window.alert($mensagem);
       });
})
Cypress.Commands.add('validaAlert', ($mensagem)=>{
    cy.get('@alert').should('have.been.calledWith', $mensagem)
})

Cypress.Commands.add('validar', ($condicao)=>{
    cy.get('body').then(()=>{
        cy.get(el.listaDeTarefas).then(() =>{
            cy.get(el.listaDeTarefas).should('have.length', $condicao);
        });
    })
})
