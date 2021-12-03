import express from 'express';
import recomendationController from '../controllers/recomendation.js';

const recomendationRouter = express.Router();

recomendationRouter.post('/', recomendationController.postRecomendation);

recomendationRouter.post('/:id/upvote', recomendationController.upvote);

recomendationRouter.post('/:id/downvote', recomendationController.downvote);

export default recomendationRouter;
