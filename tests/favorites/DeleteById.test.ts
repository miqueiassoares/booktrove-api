import { serverTest } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Favorites - DeleteById', () => {

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

  it('Delete bookid', async () => {
    const res = await serverTest
      .put('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .delete('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Try to delete bookid that does not exist', async () => {
    const res = await serverTest
      .put('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .delete('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookidff'});

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST); 
    expect(res1.body).toHaveProperty('errors'); 
  });

  it('Try to delete bookid with incompatible jwt and id', async () => {
    const res = await serverTest
      .put('/favorites/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookid'});

    expect(res.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .delete('/favorites/2')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({bookid: 'testebookidff'});

    expect(res1.status).toEqual(StatusCodes.UNAUTHORIZED); 
    expect(res1.body).toHaveProperty('errors'); 
  });

  // it('Try to search for incompatible jwt and id favorites', async () => {
  //   const res1 = await serverTest
  //     .get('/favorites/2')
  //     .set({Authorization: `Bearer ${accessToken}`})
  //     .send({bookid: 'testebookid'});

  //   expect(res1.status).toEqual(StatusCodes.UNAUTHORIZED);
  //   expect(res1.body).toHaveProperty('errors');
  // });
});