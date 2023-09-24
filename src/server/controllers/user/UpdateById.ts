import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';

interface IParamProps {
  id?: number
}

interface IBodyProps {
  fullname?: string,
  username?: string,
  gender?: string,
  dateofbirth?: Date,
  email?: string,
  password?: string
}

export const updateByIdValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      fullname: yup.string().optional().min(3).max(150),
      username: yup.string().optional().min(4).max(10),
      gender: yup.string().optional(),
      dateofbirth: yup.date().optional(),
      email: yup.string().email().optional().max(200).min(5),
      password: yup.string().optional().min(6).max(30)
    })),
    params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    }))
  }
));


export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

  if(!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      {
        errors: {
          default: 'The "id" parameter must be provided.'
        }
      }
    );
  }

  const { userIdJwt } = req.headers;

  if (Number(userIdJwt) !== Number(req.params.id)) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'The id entered is not the same as the one passed by the jwt authorization token.'
        }
      }
    );
  }

  const result = await UserProvider.updateById(req.params.id, req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send('Registration updated!');
};