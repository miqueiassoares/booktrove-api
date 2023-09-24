import supertest from 'supertest';
import { server } from '../src/server/Server';
import { Knex } from '../src/server/database/knex';
import 'dotenv/config';

beforeAll(async () => {
  await Knex.migrate.latest();
});

afterAll(async () => {
  await Knex.destroy();
});

export const serverTest = supertest(server);