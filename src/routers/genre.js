import express from 'express';
import genresController from '../controllers/genre.js';

const genreRouter = express.Router();

genreRouter.get('/', genresController.getAllGenres);

genreRouter.post('/', genresController.postGenre);

genreRouter.get('/:id', genresController.getGenre);

export default genreRouter;
