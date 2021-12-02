import express from 'express';
import recomendationController from '../controllers/recomendation.js';

const recomendationRouter = express.Router();

recomendationRouter.post('/', recomendationController.postRecomendation);

export default recomendationRouter;
