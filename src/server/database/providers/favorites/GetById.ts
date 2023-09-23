import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';   
import { IFavorites } from '../../models';

export const getById = async (userId: number): Promise<IFavorites | Error> => {
  try {
    const result = await Knex(ETablesNames.favorites)
      .select('*')
      .where('userId', '=', userId)
      .first();

    if (result) return result;

    return new Error('Erro ao consultar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao consultar o registro.');
  }
};