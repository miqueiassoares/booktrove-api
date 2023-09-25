import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETablesNames.shelves, table => {
      table.bigIncrements('id').primary().index();
      table.string('shelves', 1090).checkLength('<=', 1090).index().notNullable();
      table.integer('userid').unique().notNullable().references('id').inTable(ETablesNames.user);
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