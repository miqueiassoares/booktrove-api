import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';
import { PasswordCrypto } from '../../shared/services/PasswordCrypto';
import { JWTService } from '../../shared/services';

interface IBodyProps {
  email: string,
  password: string
}

export const signInValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      email: yup.string().required().email().min(5),
      password: yup.string().required().min(6)
    }))
  }
));


export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const {email, password} = req.body;
  
  const user = await UserProvider.getByEmail(email);
  
  if(user instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Email or password are invalid.'
        }
      }
    );
  }

  const passwordMatch = await PasswordCrypto.verifyPassword(password, user.password); 

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Email or password are invalid.'
        }
      }
    );
  } else {
    const accessToken = JWTService.sign({uid: user.id});
    
    if (accessToken === 'JWT_SECRET_NOT_FOUND') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        {
          errors: {
            default: 'Error generating access token.'
          }
        }
      );
    }

    res.status(StatusCodes.OK).json({
      userData: {
        ...user,
        password: password
      },
      accessToken: accessToken
    });
  }
  
  
};