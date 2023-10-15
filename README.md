# sistema-bancario

API de um projeto simples de sistema bancário utilizando JavaScript e Node.js

Como desafio do segundo módulo do curso de Desenvolvimento de Software com foco em Backend pela Cubos Academy, esse sistema bancário simplificado permite criar, alterar, deletar, realizar saques, depósitos e transferências, assim como consultar extratos e saldos. 

## Instalação e execução 

- Faça um fork e em seguida clone este repositório para sua utilização.
- Já dentro do diretório do arquivo, inicialize o npm digitando: npm install -y
- Baixe o express: npm install express
- Baixe o date-fns: npm install date-fns --save
- Para facilitar o uso do servidor, baixe o nodemon: npm install -D nodemon, configure o arquivo package.json para chamar o nodemon

## Rotas(porta:3000)

- GET /contas?senha_banco=Cubos123Bank \
  Lista todas as contas bancárias existentes \
  A senha do banco (Cubos123Bank) deverá ser obrigatoriamente passada na URL como parâmetro query \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/d9c23dff-1735-4aaa-9d6b-f9ac38e8189b)


- POST /contas \
  Cria uma conta bancária \
  O corpo da requisição deverá possuir: nome, cpf, data_nascimento, telefone, email e senha \
  A conta será criada com um número identificador único e saldo igual a zero \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/eced80d5-3f6f-482a-8c90-77efe1c04b61)


- PUT /contas/:numeroConta/usuario \
  Atualiza os dados de um usuário, exceto o número da conta e saldo \
  O número da conta deve ser passado na URL como parâmetro de identificação \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/23f637bb-47d9-4b17-98bd-afc081be764b)

  
- DELETE /contas/:numeroConta \
  Deleta uma conta \
  O número da conta deve ser passado na URL como parâmetro de identificação \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/a446dece-2202-45d6-980c-7573ad43f5ae)

  
- POST /transacoes/depositar \
  Transação que deposita um valor em uma conta \
  O corpo da requisição deve possuir: numero_conta e valor \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/47e0b8a3-45d6-45d5-a0d4-42ab79c80249)


- POST /transacoes/sacar \
  Transação que saca um valor de uma conta \
  O corpo da requisição deve possuir: numero_conta, valor e senha \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/9373b5fe-147d-4059-9e36-ef9760c814ae)


- POST /transacoes/transferir \
  Trasnfere valores de uma conta existente para outra \
  O corpo da requisição deve possuir: numero_conta_origem, numero_conta_destino, valor e senha \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/c6d2ee7f-2320-4a0a-9e27-7b49ed49ffb4)


- GET /contas/saldo?numero_conta=123&senha=123 \
  Consulta o saldo de uma conta específica \
  O número da conta e senha devem ser passados na URL como parâmetros query \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/b0c4e13c-59aa-4ff4-92d2-a6ff91aedc28)


- GET /contas/extrato?numero_conta=123&senha=123 \
  Consulta o extrato de transações realizadas de uma conta específica \
  O número da conta e senha devem ser passados na URL como parâmetros query \
  ![image](https://github.com/DYuriPS/sistema-bancario/assets/142267835/87ff4876-8f4e-444c-9059-0ad0396aac01)


## Tecnologias 

- JavaScript
- Node.js
- VSCode
- Git
- Bibliotecas: express, date-fns

## Autor

Douglas Yuri
