import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';

interface IParamProps {
  id?: number
}

export const getByIdValidation = validation((getSchema) => (
  {
    params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().required().positive().integer()
    }))
  }
));


export const getById = async (req: Request<IParamProps>, res: Response) => {

  const { id } = req.params;
  
  const userData = await UserProvider.getById(Number(id));
  
  if(userData instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Id is invalid.'
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
    password: ''
  });

};