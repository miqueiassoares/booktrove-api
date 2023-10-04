import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as getById from './GetById';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';

export const UserController = {
  ...signIn,
  ...signUp,
  ...getById,
  ...updateById,
  ...deleteById
}; 