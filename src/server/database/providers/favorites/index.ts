import * as create from './Create';
import * as getById from './GetById';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as deleteTable from './Delete';

export const FavoritesProvider = {
  ...create,
  ...getById,
  ...updateById,
  ...deleteById,
  ...deleteTable
};