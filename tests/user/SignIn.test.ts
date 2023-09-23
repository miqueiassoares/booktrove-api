import { StatusCodes } from 'http-status-codes';
import { serverTest } from '../jest.setup';

describe('User - SignIn', () => {

  it('accessing an account', async () => {
    const res = await serverTest
      .post('/signup')
      .send({
        fullname: 'Miquéias Castro Soares',
        username: 'maike234',
        gender: 'Male',
        dateofbirth: '2005-09-20',
        email: 'miqueiascastro@gmail.com',
        password: 'Maike124'
      });
    
    expect(res.statusCode).toEqual(StatusCodes.CREATED);
    expect(res.body).toEqual(1);

    const res1 = await serverTest
      .post('/signin')
      .send(
        {
          email: 'miqueiascastro@gmail.com',
          password: 'Maike124'
        }
      );
    
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('accessToken');
  });

  it('Entering with an unregistered email', async () => {
    const res1 = await serverTest
      .post('/signin')
      .send({
        email: 'miqueiassoares@gmail.com',
        password: 'Maike124'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Entering an invalid password', async () => {
    const res1 = await serverTest
      .post('/signin')
      .send({
        email: 'miqueiascastro@gmail.com',
        password: 'Maike1244'
      });
    
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toEqual({
      errors: {
        default: 'Email or password are invalid.'
      }
    });
  });
  it('Trying to log in without any data', async () => {
    const res1 = await serverTest
      .post('/signin')
      .send({});
    
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  
  });
});