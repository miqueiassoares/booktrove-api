import knex from 'knex';
import 'dotenv/config';
import pg from 'pg';
import { development, test, production } from './Enviroment';


if (process.env.NODE_ENV === 'production') {
  pg.types.setTypeParser(20, 'text', parseInt);
}

const getEnviroment = () => {
  switch (process.env.NODE_ENV) {
    case 'production': return production;
    case 'test': return test;
  
    default: return development;
  }
};


export const Knex = knex(getEnviroment());