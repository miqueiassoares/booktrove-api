import { Knex } from '../../knex';
import { IFavorites } from '../../models/Favorites';
import { ETablesNames } from '../../ETablesNames';


export const create = async (favorites: Omit<IFavorites, 'id'>): Promise<number | Error> => {
  try {
  
    const [result] = await Knex(ETablesNames.favorites).insert(favorites).returning('id');

    if (typeof result === 'object') {
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }

    return new Error('Error registering registration');
  } catch (error) {
    console.log(error);
    return new Error('Error registering registration');
  }
};