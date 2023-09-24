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

export const deleteByIdValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      bookid: yup.string().required().max(250).min(5),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    }))
  }
));

export const deleteById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

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

  const data = await FavoritesProvider.getById(Number(req.params.id));

  if (data instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: {
          default: 'Favorites could not be retrieved.'
        }
      }
    );
  }

  if (data.bookid.length <= 1) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: {
          default: 'There are no bookid records to delete.'
        }
      }
    );
  }

  const prevBookId = data.bookid.split(',');

  const index = prevBookId.indexOf(req.body.bookid);

  if (index === -1) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      {
        errors: {
          default : 'This bookId does not exist in favorites.'
        }
      }
    );
  }

  prevBookId.splice(index, 1);

  const newBookId = prevBookId.toString();

  const result = await FavoritesProvider.deleteById(Number(req.params.id), { bookid: newBookId });
  
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Unable to delete a bookid.'
      }
    });
  }

  res.status(StatusCodes.NO_CONTENT).send('Bookid deleted successfully!');
};