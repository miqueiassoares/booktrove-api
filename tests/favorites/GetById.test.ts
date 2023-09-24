import { serverTest } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Favorites - GetById', () => {

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

  it('Get favorites', async () => {
    const res1 = await serverTest
      .get('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res1.status).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('bookid');
    expect(res1.body).toHaveProperty('userid');
  });

  it('Try to search for incompatible jwt and id favorites', async () => {
    const res1 = await serverTest
      .get('/favorites/2')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res1.status).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });
});