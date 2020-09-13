import Knex from 'knex';

export async function up (knex: Knex): Promise<void> {
    return knex.schema.createTable('frames', (table) => {
        table.increments('id').primary();
        table
            .integer('id_user')
            .notNullable()
            .references('id')
            .inTable('users');
        table
            .integer('id_category')
            .notNullable()
            .references('id')
            .inTable('frames_categories');
        table.text('description').notNullable();
        table.string('image').notNullable();
        table.boolean('selling').notNullable();
        table.integer('qt');
        table.decimal('price');
    });
}

export async function down (knex: Knex): Promise<void> {
    return knex.schema.dropTable('frames');
}
