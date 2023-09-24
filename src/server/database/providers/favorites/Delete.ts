import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';


export const deleteTable = async (id: number): Promise<void | Error> => {
  try {
  
    const [{count}] = await Knex(ETablesNames.favorites)
      .where('userid', 'like', id)
      .count<[{count: number}]>('* as count');
    
    if (count === 0) {
      return new Error('The person used in the registration was not found.');
    }

    const result = await Knex(ETablesNames.favorites)
      .delete()
      .where('userid', '=', id);

    if (result > 0) return;

    return new Error('Error registering registration');
  } catch (error) {
    console.log(error);
    return new Error('Error registering registration');
  }
};