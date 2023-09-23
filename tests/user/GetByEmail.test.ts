import { StatusCodes } from 'http-status-codes';
import { serverTest } from '../jest.setup';

describe('User - GetByEmail', () => {

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
  
  it('Getting user', async () => {

    const res1 = await serverTest
      .get('/user')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        email: 'anabeatriz12@gmail.com',
        password: 'ana90219'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('fullname');
  });

  it('Trying to catch user with invalid email', async () => {

    const res1 = await serverTest
      .get('/user')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        email: 'anabeatrz12@gmail.com',
        password: 'ana90219'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Trying to catch user with invalid password', async () => {

    const res1 = await serverTest
      .get('/user')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        email: 'anabeatriz12@gmail.com',
        password: 'ana9219'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Trying to catch user with userId and data returned by email incompatible', async () => {

    const res1 = await serverTest
      .get('/user')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        email: 'anabeatriz12@gmail.com',
        password: 'ana9219'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });
  
});
