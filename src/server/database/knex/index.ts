import knex from 'knex';
import 'dotenv/config';
import { development, test } from './Enviroment';

const getEnviroment = () => {
  switch (process.env.NODE_ENV) {
    case 'test': return test;
  
    default: return development;
  }
};


export const Knex = knex(getEnviroment());