import { StatusCodes } from 'http-status-codes';
import { serverTest } from '../jest.setup';

describe('User - SignUp', () => {
  it('should register a user', async () => {
    const res1 = await serverTest
      .post('/signup')
      .send(
        {
          fullname: 'Miquéias Castro Soares',
          username: 'maike123',
          gender: 'Male',
          dateofbirth: '2005-09-20',
          email: 'miqueiascastro@gmail.com',
          password: 'Mike12345'
        }
      );
    
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(res1.body).toBe(1);
  });

  it('Invalid age.', async () => {
    const res1 = await serverTest
      .post('/signup')
      .send(
        {
          fullname: 'Miquéias Castro Soares',
          username: 'maike123',
          gender: 'Male',
          dateofbirth: '2015-09-20',
          email: 'miqueiascastro@gmail.com',
          password: 'Mike12345'
        }
      );
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Try to register a user with an existing email address.', async () => {
    const res1 = await serverTest
      .post('/signup')
      .send(
        {
          fullname: 'Ana Beatriz',
          username: 'anayu123',
          gender: 'Female',
          dateofbirth: '2009-09-20',
          email: 'anabeatriz@gmail.com',
          password: 'Mike12345'
        }
      );

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(res1.body).toBe(2);

    const res2 = await serverTest
      .post('/signup')
      .send(
        {
          fullname: 'Ana Bia',
          username: 'anadyu123',
          gender: 'Female',
          dateofbirth: '2009-09-20',
          email: 'anabeatriz@gmail.com',
          password: 'Mike12345'
        }
      );
    
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toEqual({errors: { default: 'Unable to register user.'}});
  });

  it('trying to register user without any data', async () => {
    const res = await serverTest.post('/signup').send({});

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });
});