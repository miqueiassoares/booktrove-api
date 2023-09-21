import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETablesNames.user, table => {
      table.bigIncrements('id').primary().index();
      table.string('fullname', 150).checkLength('<=', 150).index().notNullable();
      table.string('username', 10).checkLength('<=', 10).unique().index().notNullable();
      table.string('gender', 7).checkLength('<=', 7).notNullable();
      table.integer('age').checkPositive().notNullable();
      table.string('email', 200, ).checkLength('<=', 200).unique().notNullable();
      table.string('password', 150).checkLength('<=', 150).notNullable();
    })
    .then(() => {
      console.log(`# Create table ${ETablesNames.user}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETablesNames.user)
    .then(() => {
      console.log(`# Dropped table ${ETablesNames.user}`);
    });
}