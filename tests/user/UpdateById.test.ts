import { StatusCodes } from 'http-status-codes';
import { serverTest } from '../jest.setup';

describe('User - UpdateById', () => {

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
  
  it('Updating user', async () => {

    const res1 = await serverTest
      .put('/user/1')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        fullname: 'Ana Beatriz'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Trying to update user with jwt and id incompatible', async () => {

    const res1 = await serverTest
      .put('/user/2')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        fullname: 'Ana Beatriz'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });
  
});
