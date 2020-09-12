import Knex from 'knex';

export async function up (knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('token').notNullable();
        table.string('whatsapp');
        table.string('avatar');
        table.string('bio');
    });
}

export async function down (knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}
