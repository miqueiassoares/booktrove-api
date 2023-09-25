import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IShelves } from '../../models';


export const create = async (shelves: Omit<IShelves, 'id'>): Promise<number | Error> => {
  try {
  
    const [result] = await Knex(ETablesNames.shelves).insert(shelves).returning('id');

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