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
});