import * as createShelf from './CreateShelf';
import * as updateShelves from './UpdateShelves';
import * as getById from './GetById';

export const ShelvesController = {
  ...createShelf,
  ...updateShelves,
  ...getById
};