import { Knex } from '../../knex';
import { IUser } from '../../models/User';
import { ETablesNames } from '../../ETablesNames';


export const create = async (user: Omit<IUser, 'id'>): Promise<number | Error> => {
  try {
    const [result] = await Knex(ETablesNames.user).insert(user).returning('id');

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