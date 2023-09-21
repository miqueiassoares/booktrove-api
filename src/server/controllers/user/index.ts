import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as getByEmail from './GetByEmail';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';

export const UserController = {
  ...signIn,
  ...signUp,
  ...getByEmail,
  ...updateById,
  ...deleteById
}; 