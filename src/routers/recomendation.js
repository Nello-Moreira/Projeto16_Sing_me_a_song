import express from 'express';
import recomendationController from '../controllers/recomendation.js';

const recomendationRouter = express.Router();

recomendationRouter.post('/', recomendationController.postRecomendation);

recomendationRouter.post('/:id/upvote', recomendationController.upvote);

export default recomendationRouter;
