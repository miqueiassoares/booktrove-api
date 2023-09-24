import { serverTest } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Favorites - UpdateById', () => {

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

  it('Update bookid.', async () => {
    const res1 = await serverTest
      .put('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Try to update with incompatible jwt and id.', async () => {
    const res1 = await serverTest
      .put('/favorites/2')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res1.status).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });
});