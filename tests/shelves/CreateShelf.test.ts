import { serverTest } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Shelves - CreateShelf', () => {
  let accessToken = '';

  beforeAll(async () => {
    const res1 = await serverTest
      .post('/signup')
      .send(
        {
          fullname: 'Ana Beatriz Da Silva',
          username: 'anab123',
          gender: 'Female',
          dateofbirth: '2004-02-10',
          email: 'anabeatriz12@gmail.com',
          password: 'ana90219'
        }
      );
    
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    
    const res2 = await serverTest
      .post('/signin')
      .send({
        email: 'anabeatriz12@gmail.com',
        password: 'ana90219'
      });
    
    accessToken = res2.body.accessToken;
  });

  it('Create shelf', async () => {
    const res1 = await serverTest
      .put('/shelves')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        bookid: 'biejasoeiwo',
        userid: 1
      });

    expect(res1.status).toEqual(StatusCodes.CREATED);
  });

  it('No bookid', async () => {
    const res1 = await serverTest
      .put('/shelves')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        userid: 1
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

  it('No shelfname', async () => {
    const res1 = await serverTest
      .put('/shelves')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        bookid: 'lfajieiei',
        userid: 1
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });
});