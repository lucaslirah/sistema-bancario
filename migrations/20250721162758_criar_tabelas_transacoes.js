exports.up = function(knex) {
  return knex.schema
    // Tabela de depósitos
    .createTable('depositos', table => {
      table.increments('id').primary()
      table
        .string('numero_conta', 11)
        .notNullable()
        .comment('conta que recebeu o depósito')
      table
        .decimal('valor', 14, 2)
        .notNullable()
        .comment('valor depositado')
      table
        .timestamp('data')
        .defaultTo(knex.fn.now())
        .comment('data e hora do depósito')

      // chave estrangeira para garantir integridade
      table
        .foreign('numero_conta')
        .references('numero_conta')
        .inTable('contas')
        .onDelete('CASCADE')
    })
    // Tabela de saques
    .then(() => knex.schema.createTable('saques', table => {
      table.increments('id').primary()
      table
        .string('numero_conta', 11)
        .notNullable()
        .comment('conta que realizou o saque')
      table
        .decimal('valor', 14, 2)
        .notNullable()
        .comment('valor sacado')
      table
        .timestamp('data')
        .defaultTo(knex.fn.now())
        .comment('data e hora do saque')

      table
        .foreign('numero_conta')
        .references('numero_conta')
        .inTable('contas')
        .onDelete('CASCADE')
    }))
    // Tabela de transferências
    .then(() => knex.schema.createTable('transferencias', table => {
      table.increments('id').primary()
      table
        .string('numero_conta_origem', 11)
        .notNullable()
        .comment('conta que enviou a transferência')
      table
        .string('numero_conta_destino', 11)
        .notNullable()
        .comment('conta que recebeu a transferência')
      table
        .decimal('valor', 14, 2)
        .notNullable()
        .comment('valor transferido')
      table
        .timestamp('data')
        .defaultTo(knex.fn.now())
        .comment('data e hora da transferência')

      table
        .foreign('numero_conta_origem')
        .references('numero_conta')
        .inTable('contas')
        .onDelete('CASCADE')
      table
        .foreign('numero_conta_destino')
        .references('numero_conta')
        .inTable('contas')
        .onDelete('CASCADE')
    }))
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('transferencias')
    .then(() => knex.schema.dropTableIfExists('saques'))
    .then(() => knex.schema.dropTableIfExists('depositos'))
}