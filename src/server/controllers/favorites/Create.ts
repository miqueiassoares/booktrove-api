import { Request, Response } from 'express';
import { IFavorites } from '../../database/models';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { FavoritesProvider } from '../../database/providers/favorites';
import { StatusCodes } from 'http-status-codes';

interface IBodyProps extends Omit<IFavorites, 'id'> {}

export const createValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      bookId: yup.string().max(250).min(6).required(),
      userId: yup.number().integer().positive().required()
    }))
  }
));

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const { userId } = req.headers;

  if (Number(userId) !== Number(req.body.userId)) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Mismatched Jwt authorization token and userId.'
        }
      }
    );
  }

  const favoritesExist = await FavoritesProvider.getById(req.body.userId);

  if (!(favoritesExist instanceof Error)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      {
        errors: {
          default: 'Favorites already exist for this user.'
        }
      }
    );
  }

  const result  = await FavoritesProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: {
          default: 'Unable to create favorites.'
        }
      }
    );
  }

  res.status(StatusCodes.CREATED).json(result);
};