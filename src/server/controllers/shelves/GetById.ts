import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { ShelvesProvider } from '../../database/providers/shelves';

interface IParamsProps {
  id?: number
}

export const getByIdValidation = validation((getSchema) => (
  {
    params: getSchema<IParamsProps>(yup.object().shape({
      id: yup.number().required().positive().integer()
    }))
  }
));

export const getById = async (req: Request<IParamsProps>, res: Response) => {

  const { userIdJwt } = req.headers;

  if (Number(userIdJwt) !== Number(req.params.id)) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Mismatched Jwt authorization token and userId.'
        }
      }
    );
  }

  const result = await ShelvesProvider.getById(Number(req.params.id));

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: {
          default: 'Shelves could not be retrieved.'
        }
      }
    );
  }

  res.status(StatusCodes.OK).json({
    ...result,
    shelves: JSON.parse(result.shelves)
  });
};