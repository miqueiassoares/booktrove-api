import * as create from './Create';
import * as getById from './GetById';
import * as createShelf from './/CreateShelf';
import * as deleteTable from './Delete';

export const ShelvesProvider = {
  ...create,
  ...getById,
  ...createShelf,
  ...deleteTable
};