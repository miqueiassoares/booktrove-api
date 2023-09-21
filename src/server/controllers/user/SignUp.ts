import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';
import { IUser } from '../../database/models/User';

interface IBodyProps extends Omit<IUser, 'id'> {
  
}

export const signUpValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      fullname: yup.string().required().min(3).max(150),
      username: yup.string().required().min(4).max(10),
      gender: yup.string().required(),
      age: yup.number().required().moreThan(12).lessThan(121),
      email: yup.string().email().required().max(200).min(5),
      password: yup.string().required().min(6).max(30)
    }))
  }
));

export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const result = await UserProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: {
          default: 'Unable to register user.'
        }
      }
    );
  }

  res.status(StatusCodes.CREATED).json(result);
  
};