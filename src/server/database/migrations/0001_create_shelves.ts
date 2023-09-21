import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETablesNames.shelves, table => {
      table.bigIncrements('id').primary().index();
      table.string('shelfname', 50).checkLength('<=', 50).index().notNullable();
      table.string('bookid', 250).checkLength('<=', 250).notNullable();
      table.integer('userid').checkPositive().notNullable();
    })
    .then(() => {
      console.log(`# Create table ${ETablesNames.shelves}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETablesNames.shelves)
    .then(() => {
      console.log(`# Dropped table ${ETablesNames.shelves}`);
    });
}