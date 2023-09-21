import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as getById from './GetById';

export const UserController = {
  ...signIn,
  ...signUp,
  ...getById
}; 