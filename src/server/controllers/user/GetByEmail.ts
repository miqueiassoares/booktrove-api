import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';
import { PasswordCrypto } from '../../shared/services';

interface IBodyProps {
  email: string,
  password: string
}

export const getByEmailValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      email: yup.string().required().email().min(5),
      password: yup.string().required().min(6)
    }))
  }
));


export const getByEmail = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const {email, password} = req.body;
  
  const userData = await UserProvider.getByEmail(email);
  
  if(userData instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Email or password are invalid.'
        }
      }
    );
  }

  const passwordMatch = await PasswordCrypto.verifyPassword(password, userData.password); 

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Email or password are invalid.'
        }
      }
    );
  }

  const { userIdJwt } = req.headers;

  if (Number(userIdJwt) !== Number(userData.id)) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'mismatched Jwt authorization token and user id.'
        }
      }
    );
  }

  res.status(StatusCodes.OK).json({ 
    ...userData,
    password: password
  });

};