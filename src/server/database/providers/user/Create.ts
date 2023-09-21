import { Knex } from '../../knex';
import { IUser } from '../../models/User';
import { ETablesNames } from '../../ETablesNames';
import { PasswordCrypto } from '../../../shared/services/PasswordCrypto';


export const create = async (user: Omit<IUser, 'id'>): Promise<number | Error> => {
  try {
    const passwordHash = await PasswordCrypto.hashPassword(user.password);
    user.password = passwordHash;
    
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