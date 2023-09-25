import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { ShelvesProvider } from '../../database/providers/shelves';

interface IParamProps {
  id?: number,
}

interface IBodyProps {
  shelfname: string,
  newshelfname?: string,
  bookid?: string,
  newbookid?: string,
  action: string  // changename | add | delete | addshelf | deleteshelf
}

export const updateShelvesValidation = validation((getSchema) => (
  {
    body: getSchema<IBodyProps>(yup.object().shape({
      shelfname: yup.string().required().min(1).max(30),
      newshelfname: yup.string().optional().min(1).max(30),
      bookid: yup.string().optional().min(3).max(40),
      newbookid: yup.string().optional().min(3).max(40),
      action: yup.string().required()
    })),
    params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    }))
  }
));

export const updateShelves = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

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

  let prevShelfList = JSON.parse(result.shelves);


  switch (req.body.action) {
    case 'changename':
      if (req.body.newshelfname) {

        let itFound = false;
        
        for (let i = 0; i < prevShelfList.length; i++) {

          if (prevShelfList[i].shelfname === req.body.shelfname) {
            prevShelfList[i].shelfname = req.body.newshelfname;
            itFound = true;
            break;
          }
          
        }

        if (!itFound) {
          return res.status(StatusCodes.BAD_REQUEST).json(
            {
              errors: {
                default: 'This shelf does not exist, therefore it cannot be changed.'
              }
            }
          );
        }

      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: {
            default: 'To complete this action you must enter the new name of the shelf'
          }
        });
      }
      break;
    case 'add': 
      if (req.body.newbookid) {
        for (let i = 0; i < prevShelfList.length; i++) {

          if (prevShelfList[i].shelfname === req.body.shelfname) {
            const booklist = prevShelfList[i].bookidlist;

            if (booklist.length >= 10) {
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                  default: 'The list of books for this shelf has reached its maximum'
                }
              });
            }

            prevShelfList[i].bookidlist = [...booklist, req.body.newbookid];
            break;
          }
          
        }
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: {
            default: 'You must inform the new book id.'
          }
        });
      }
      break;
    case 'delete':

      if (req.body.bookid) {

        let itFound = false;

        for (let i = 0; i < prevShelfList.length; i++) {

          if (prevShelfList[i].shelfname === req.body.shelfname) {
            const booklist: string[] = prevShelfList[i].bookidlist;

            itFound = true;

            if (booklist.length === 0) {
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                  default: 'The list of books for this shelf has reached its minimun'
                }
              });
            }

            const index: number = booklist.indexOf(req.body.bookid);
            
            prevShelfList[i].bookidlist.splice(index, 1);

            if (index === -1) {
              return res.status(StatusCodes.BAD_REQUEST).json(
                {
                  errors: {
                    default: 'This id does not exist in the books list, therefore it is not possible to delete it.'
                  }
                }
              );
            }

            
          }
          
        }

        if (!itFound) {
          return res.status(StatusCodes.BAD_REQUEST).json(
            {
              errors: {
                default: 'This shelf does not exist, therefore it cannot be changed.'
              }
            }
          );
        }
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: {
            default: 'You must inform the book id.'
          }
        });
      }
      break;
    case 'addshelf':
      if (req.body.shelfname) {
        if (prevShelfList.length >= 5) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
              default: 'The limit of 5 shelves has been reached.'
            }
          });
        }
        prevShelfList = [
          ...prevShelfList,
          {
            shelfname: req.body.shelfname,
            bookidlist: []
          }
        ];
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: {
            default: 'To add a new shelf, the "shelfname" field must be entered.'
          }
        });
      }
      break;
    case 'deleteshelf': 
      if (req.body.shelfname) {
        if (prevShelfList.length === 0) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
              default: 'The limit of 0 shelves has been reached.'
            }
          });
        }

        let itFound = false;

        for (let i = 0; i < prevShelfList.length; i++) {
          const element = prevShelfList[i];

          if (element.shelfname === req.body.shelfname) {
            prevShelfList.splice(i, 1);
            itFound = true;
          }
          
        }

        if (!itFound) {
          return res.status(StatusCodes.BAD_REQUEST).json(
            {
              errors: {
                default: 'This shelf does not exist, therefore it cannot be deleted.'
              }
            }
          );
        }
        
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: {
            default: 'To add a new shelf, the "shelfname" field must be entered.'
          }
        });
      }
      break;
    default:
      return res.status(StatusCodes.BAD_REQUEST).json(
        {
          errors: {
            default: 'You must inform the action field. Example: changename, add, delete, addshelf, deleteshelf '
          }
        }
      );
  }

  const createShelf = await ShelvesProvider.createShelf({shelves: JSON.stringify(prevShelfList)}, Number(req.params.id));

  if (createShelf instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Unable to add shelf.'
      }
    });
  }

  res.status(StatusCodes.NO_CONTENT).send('Shelves has beed updated successfully!');
};