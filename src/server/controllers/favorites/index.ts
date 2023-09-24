import * as getById from './GetById';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';

export const FavoritesController = {
  ...getById,
  ...updateById,
  ...deleteById
};