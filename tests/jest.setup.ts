import supertest from 'supertest';
import { server } from '../src/server/Server';
import { Knex } from '../src/server/database/knex';
import 'dotenv/config';

export let accessToken = '';

beforeAll(async () => {
  await Knex.migrate.latest();

  await serverTest.post('/cadastrar').send({
    fullname: 'Miquéias Castro Soares',
    username: 'maike123',
    gender: 'Male',
    dateofbirth: '2005-09-20',
    email: 'miqueiascastro@gmail.com',
    password: 'Mike12345'
  });

  const signInRes = await serverTest.post('/entrar').send({email: 'miqueiascastro@gmail.com', password: 'Mike12345'});

  accessToken = signInRes.body.accessToken;
});

afterAll(async () => {
  await Knex.destroy();
});

export const serverTest = supertest(server);