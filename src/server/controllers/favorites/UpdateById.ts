import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { FavoritesProvider } from '../../database/providers/favorites';
import { StatusCodes } from 'http-status-codes';

interface IBodyProps {
  bookid: string
}
interface IParamProps {
  id?: number
}

export const updateByIdValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      bookid: yup.string().required().max(250).min(5),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    }))
  }
));

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

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

  const result = await FavoritesProvider.getById(Number(req.params.id));


  if (result instanceof Error) {
    const createFavorties = await FavoritesProvider.create({bookid: `${req.body.bookid},`, userid: Number(req.params.id)});

    if (createFavorties instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        {
          errors: {
            default: 'Favorites could not be retrieved.'
          }
        }
      );
    }

    return res.status(StatusCodes.NO_CONTENT).json('Favorites has been updated successfully!');
  }

  const prevBookId = result.bookid;

  const newBookId = prevBookId+`${req.body.bookid},`;  

  const updateFavorites = await FavoritesProvider.updateById(Number(req.params.id) , { bookid: newBookId});

  if (updateFavorites instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: updateFavorites.message
      }
    });
  }

  res.status(StatusCodes.NO_CONTENT).send('Favorites has been updated successfully!');
};