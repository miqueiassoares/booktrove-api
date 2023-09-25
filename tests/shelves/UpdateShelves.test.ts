import { serverTest } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Shelves - UpdateShelves', () => {
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

  it('Add shelf', async () => {
    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'addshelf'
      });

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Add bookid', async () => {
    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        newbookid: 'çjfieioafe',
        action: 'add'
      });

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Delete bookid', async () => {
    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        bookid: 'çjfieioafe',
        action: 'delete'
      });

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Change name of shelf', async () => {
    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        newshelfname: 'Ler depois',
        action: 'changename'
      });

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Delete shelf', async () => {
    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler depois',
        action: 'deleteshelf'
      });

    expect(res1.status).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Try to delete a shelf that doesnt exist', async () => {

    const res0 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'addshelf'
      });

    expect(res0.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler depois',
        action: 'deleteshelf'
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('Try to delete shelf when there is no saved', async () => {

    const res0 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'deleteshelf'
      });

    expect(res0.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'deleteshelf'
      });

    expect(res1.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('Try to change name without newshelfname', async () => {

    const res0 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'addshelf'
      });

    expect(res0.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'changename'
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Try to change name without shelfname', async () => {

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        newshelfname: 'Ler depois',
        action: 'changename'
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Try to add bookid without newbookid', async () => {

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'add'
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

  it('Try to delete bookid without bookid', async () => {

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler mais tarde',
        action: 'delete'
      });

    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors');
  });

  it('tries to delete bookid but the bookid list is empty', async () => {

    const res0 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler ainda hoje',
        action: 'addshelf'
      });

    expect(res0.status).toEqual(StatusCodes.NO_CONTENT);

    const res1 = await serverTest
      .put('/shelves/1')
      .set({Authorization: `Bearer ${accessToken}`})
      .send({
        shelfname: 'Ler ainda hoje',
        bookid: 'jeijowejf',
        action: 'delete'
      });

    expect(res1.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors');
  });
});