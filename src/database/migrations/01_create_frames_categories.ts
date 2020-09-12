import Knex from 'knex';

export async function up (knex: Knex): Promise<void> {
    return knex.schema.createTable('frames_categories', (table) => {
        table.increments('id').primary();
        table.string('keyword').unique().notNullable();
        table.text('description').notNullable();
        table.string('image').notNullable();
    });
}

export async function down (knex: Knex): Promise<void> {
    return knex.schema.dropTable('frames_categories');
}
