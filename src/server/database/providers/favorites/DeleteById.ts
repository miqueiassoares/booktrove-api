import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';   

interface IBookId {
  bookid: string
}

export const deleteById = async (id: number, bookId: IBookId): Promise<void | Error> => {
  try {

    const result = await Knex(ETablesNames.favorites)
      .update(bookId)
      .where('userid', '=', id);

    if (result > 0) return;

    return new Error('Erro ao deletar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao deletar o registro.');
  }
};