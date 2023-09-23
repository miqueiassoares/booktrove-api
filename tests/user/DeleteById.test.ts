import { StatusCodes } from 'http-status-codes';
import { serverTest } from '../jest.setup';

describe('User - DeleteById', () => {

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

  it('Deleting user', async () => {

    const res3 = await serverTest
      .delete('/user/1')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    
    expect(res3.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Try to delete user with incompatible jwt and userId', async () => {
    const res1 = await serverTest
      .delete('/user/2')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });
  
  it('Try to delete user without id', async () => {
    const res1 = await serverTest
      .delete('/user/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    
    expect(res1.statusCode).toEqual(StatusCodes.NOT_FOUND);
  });

  it('Try to delete user with id 0', async () => {
    const res1 = await serverTest
      .delete('/user/0')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

});
