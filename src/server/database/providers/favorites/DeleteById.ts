import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';   

interface IBookId {
  bookid: string
}

export const deleteById = async (id: number, bookId: IBookId): Promise<void | Error> => {
  try {

    const [{count}] = await Knex(ETablesNames.favorites)
      .where('id', 'like', id)
      .count<[{count: number}]>('* as count');
    
    if (count === 0) {
      return new Error('There are no records in the favorites table for this Id.');
    }

    const result = await Knex(ETablesNames.favorites)
      .update(bookId)
      .where('userId', '=', id);

    if (result > 0) return;

    return new Error('Erro ao deletar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao deletar o registro.');
  }
};