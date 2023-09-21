import { IFavorites, IShelves, IUser } from '../../models';

declare module 'knex/types/tables' {
  interface Tables {
    user: IUser;
    shelves: IShelves;
    favorites: IFavorites;
  }
}