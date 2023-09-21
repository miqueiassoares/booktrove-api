import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';

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
  console.log(typeof req.body);

  res.status(StatusCodes.ACCEPTED).send('Está funcionando!');
  
};