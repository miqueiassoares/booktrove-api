import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';

interface IShelves {
  shelves: string
}

export const createShelf = async (shelves: IShelves, userid: number): Promise<void | Error> => {
  try {

    const [{count}] = await Knex(ETablesNames.shelves)
      .where('userid', 'like', userid)
      .count<[{count: number}]>('* as count');
    
    if (count === 0) {
      return new Error('There are no records in the shelves table for this Id.');
    }

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