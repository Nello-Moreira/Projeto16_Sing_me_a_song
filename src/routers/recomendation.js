import express from 'express';
import recomendationController from '../controllers/recomendation.js';

const recomendationRouter = express.Router();

recomendationRouter.post('/', recomendationController.postRecomendation);

recomendationRouter.post('/:id/upvote', recomendationController.upvote);

recomendationRouter.post('/:id/downvote', recomendationController.downvote);

recomendationRouter.get('/top/:amount', recomendationController.getTopAmount);

export default recomendationRouter;
