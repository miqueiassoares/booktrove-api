import { PasswordCrypto } from '../../../shared/services';
import { ETablesNames } from '../../ETablesNames';
import { Knex } from '../../knex';   

interface IUserData {
  fullname?: string,
  username?: string,
  gender?: string,
  dateofbirth?: Date,
  email?: string,
  password?: string
}


export const updateById = async (id: number, data: IUserData ): Promise<void | Error> => {
  try {

    if (data.password) {
      const passwordHash = await PasswordCrypto.hashPassword(data.password);
      data.password = passwordHash;
    }

    const result = await Knex(ETablesNames.user)
      .update(data)
      .where('id', '=', id);

    if (result > 0) return;

    return new Error('Erro ao atualizar o registro.');
  } catch(error) {
    console.log(error);
    return new Error('Erro ao atualizar o registro.');
  }
};