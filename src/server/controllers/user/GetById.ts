import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface IParamProps {
  id: number
}

export const getById = async (req: Request<IParamProps>, res: Response) => {

  if(!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      {
        errors: {
          default: 'The "id" parameter must be provided.'
        }
      }
    );
  }

  res.status(StatusCodes.OK).json({
    email: 'miqueiascastros7@gmail.com',
    password: 'MIKE007seagain99.22'
  });
  
};