exports.up = function(knex) {
  return knex.schema.createTable('contas', table => {
    table.increments('id').primary()                        // PK autoincremental
    table.string('numero_conta', 11).notNullable().unique() // número da conta igual ao telefone sem formatação
    table.string('nome').notNullable()                      // nome do titular
    table.string('cpf', 11).notNullable().unique()          // CPF sem formatação
    table.date('data_nascimento').notNullable()             // data de nascimento
    table.string('telefone', 11).notNullable()              // telefone sem formatação
    table.string('email').notNullable().unique()            // e-mail único
    table.string('senha').notNullable()                     // senha (hash futura)
    table.enu('role', ['cliente','admin','suporte'])
    .notNullable().defaultTo('cliente')                      // perfil de acesso
    table.decimal('saldo', 14, 2).notNullable().defaultTo(0) // saldo com duas casas
    table.timestamps(true, true)                            // created_at e updated_at
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('contas')
}