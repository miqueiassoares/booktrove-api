import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController, FavoritesController, ShelvesController } from '../controllers';
import { ensureAuthenticated } from '../shared/middleware/EnsureAuthenticated';


const router = Router();

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).send('App running!');
});

// user

router.post('/signin', UserController.signInValidation, UserController.signIn);
router.post('/signup', UserController.signUpValidation, UserController.signUp);
router.get('/user/:id', ensureAuthenticated, UserController.getByIdValidation , UserController.getById);
router.put('/user/:id', ensureAuthenticated, UserController.updateByIdValidation , UserController.updateById);
router.delete('/user/:id', ensureAuthenticated, UserController.deleteByIdValidation , UserController.deleteById);

// favorites

router.get('/favorites/:id', ensureAuthenticated, FavoritesController.getByIdValidation, FavoritesController.getById);
router.put('/favorites/:id', ensureAuthenticated, FavoritesController.updateByIdValidation, FavoritesController.updateById);
router.delete('/favorites/:id', ensureAuthenticated, FavoritesController.deleteByIdValidation, FavoritesController.deleteById);


// shelves

router.put('/shelves', ensureAuthenticated, ShelvesController.createShelfIdValidation, ShelvesController.createShelf);
router.put('/shelves/:id', ensureAuthenticated, ShelvesController.updateShelvesValidation, ShelvesController.updateShelves);
router.get('/shelves/:id', ensureAuthenticated, ShelvesController.getByIdValidation, ShelvesController.getById);

export { router };
