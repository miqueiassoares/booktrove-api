import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';


export const deleteTable = async (id: number): Promise<void | Error> => {
  try {

    const result = await Knex(ETablesNames.shelves)
      .delete()
      .where('userid', '=', id);

    if (result > 0) return;

    return new Error('Error registering registration');
  } catch (error) {
    console.log(error);
    return new Error('Error registering registration');
  }
};