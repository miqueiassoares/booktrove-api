import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';

export const deleteById = async (id: number): Promise<void | Error> => {
  try {

    const [{count}] = await Knex(ETablesNames.user)
      .where('id', 'like', id)
      .count<[{count: number}]>('* as count');
    
    if (count === 0) {
      return new Error('The person used in the registration was not found.');
    }

    const result = await Knex(ETablesNames.user)
      .delete()
      .where('id', '=', id);

    if (result > 0) return;

    return new Error('Erro ao consultar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao consultar o registro.');
  }
};