import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { ShelvesProvider } from '../../database/providers/shelves';

interface IBodyProps {
  shelfname: string,
  bookid: string,
  userid: number
}

export const createShelfIdValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      shelfname: yup.string().required().max(30).min(1),
      bookid: yup.string().required().max(20),
      userid: yup.number().integer().required().moreThan(0)
    })),
  }
));

export const createShelf = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const { userIdJwt } = req.headers;

  if (Number(userIdJwt) !== Number(req.body.userid)) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      {
        errors: {
          default: 'Mismatched Jwt authorization token and userId.'
        }
      }
    );
  }

  const result = await ShelvesProvider.getById(Number(req.body.userid));

  if (result instanceof Error) {
    const createShelves = await ShelvesProvider.create({ shelves: '[]', userid: Number(req.body.userid)});

    if (createShelves instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        {
          errors: {
            default: 'Shelves could not be retrieved.'
          }
        }
      );
    }

    return res.status(StatusCodes.OK).json(createShelves);
  }

  const prevShelfList = JSON.parse(result.shelves);

  const newShelfList = [
    ...prevShelfList,
    {
      shelfname: req.body.shelfname,
      bookidlist: [req.body.bookid]
    }
  ];

  const createShelf = await ShelvesProvider.createShelf({shelves: JSON.stringify(newShelfList)}, Number(req.body.userid));

  if (createShelf instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Unable to add shelf.'
      }
    });
  }

  res.status(StatusCodes.CREATED).send('Shelves has been created successfully!');
};