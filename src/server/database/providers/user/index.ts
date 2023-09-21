import * as create from './Create';
import * as getByEmail from './GetByEmail';
import * as update from './Update';
import * as deleteById from './Delete';

export const UserProvider = {
  ...create,
  ...getByEmail,
  ...update,
  ...deleteById
};