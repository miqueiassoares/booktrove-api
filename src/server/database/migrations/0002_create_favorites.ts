import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETablesNames.favorites, table => {
      table.bigIncrements('id').primary().index();
      table.string('bookid', 250).checkLength('<=', 250).notNullable();
      table.integer('userId').unique().notNullable().references('id').inTable(ETablesNames.user);
    })
    .then(() => {
      console.log(`# Create table ${ETablesNames.favorites}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETablesNames.favorites)
    .then(() => {
      console.log(`# Dropped table ${ETablesNames.favorites}`);
    });
}