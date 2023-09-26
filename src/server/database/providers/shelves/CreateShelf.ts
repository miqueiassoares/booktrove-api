import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';

interface IShelves {
  shelves: string
}

export const createShelf = async (shelves: IShelves, userid: number): Promise<void | Error> => {
  try {

    const result = await Knex(ETablesNames.shelves)
      .update(shelves)
      .where('userId', '=', userid);

    if (result > 0) return;

    return new Error('Erro ao atualizar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao atualizar o registro.');
  }
};