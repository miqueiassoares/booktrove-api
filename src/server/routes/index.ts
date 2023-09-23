import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from '../controllers';
import { ensureAuthenticated } from '../shared/middleware/EnsureAuthenticated';
import { FavoritesController } from '../controllers/favorites';


const router = Router();

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).send('Api funcionando!');
});

// user

router.post('/signin', UserController.signInValidation, UserController.signIn);
router.post('/signup', UserController.signUpValidation, UserController.signUp);
router.get('/user', ensureAuthenticated, UserController.getByEmailValidation , UserController.getByEmail);
router.put('/user/:id', ensureAuthenticated, UserController.updateByIdValidation , UserController.updateById);
router.delete('/user/:id', ensureAuthenticated, UserController.deleteByIdValidation , UserController.deleteById);

// favorites

router.post('/favorites', ensureAuthenticated, FavoritesController.createValidation, FavoritesController.create);
router.get('/favorites/:id', ensureAuthenticated, FavoritesController.getByIdValidation, FavoritesController.getById);

export { router };
