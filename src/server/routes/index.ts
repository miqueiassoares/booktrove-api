import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from '../controllers';


const router = Router();

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).send('Api funcionando!');
});

// user

router.post('/signin', UserController.signIn);
router.post('/signup', UserController.signUpValidation, UserController.signUp);
router.get('/user/:id', UserController.getById);



export { router };
