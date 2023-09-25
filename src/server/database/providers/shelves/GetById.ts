import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';   
import { IShelves } from '../../models';

export const getById = async (userid: number): Promise<IShelves | Error> => {
  try {
    const result = await Knex(ETablesNames.shelves)
      .select('*')
      .where('userid', '=', userid)
      .first();

    if (result) return result;

    return new Error('Erro ao consultar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao consultar o registro.');
  }
};