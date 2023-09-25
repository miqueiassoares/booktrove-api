import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { UserProvider } from '../../database/providers/user';
import { FavoritesProvider } from '../../database/providers/favorites';
import { ShelvesProvider } from '../../database/providers/shelves';

interface IParamProps {
  id?: number
}

export const deleteByIdValidation = validation((getSchema) => (
  {
    params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    }))
  }
));


export const deleteById = async (req: Request<IParamProps>, res: Response) => {

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

  const deleteFavorites = await FavoritesProvider.deleteTable(req.params.id);

  if (deleteFavorites instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Error when deleting user favorites.'
      }
    });
  }

  const deleteShelves = await ShelvesProvider.deleteTable(req.params.id);

  if (deleteShelves instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: {
          default: 'Error when deleting user shelves'
        }
      }
    );
  }

  const result = await UserProvider.deleteById(req.params.id);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send('Registration updated!');
};