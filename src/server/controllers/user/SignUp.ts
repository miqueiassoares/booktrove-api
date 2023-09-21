import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';
import { IUser } from '../../database/models/User';

interface IBodyProps extends Omit<IUser, 'id'> {
  
}

function dateValidation(dateofbirth: Date) {
  const userDate = new Date(dateofbirth);
  
  const dateNow = new Date();
  
  
  const diff = Number(dateNow) - Number(userDate);
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  
  return age;
}



export const signUpValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      fullname: yup.string().required().min(3).max(150),
      username: yup.string().required().min(4).max(10),
      gender: yup.string().required(),
      dateofbirth: yup.date().required(),
      email: yup.string().email().required().max(200).min(5),
      password: yup.string().required().min(6).max(30)
    }))
  }
));

export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const userAge = dateValidation(req.body.dateofbirth);
  
  if (userAge < 13 || userAge > 119) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      {
        errors: {
          default: 'It is not possible to register a user of this age.'
        }
      }
    );
  }

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