import express from 'express';
import recommendationController from '../controllers/recommendation.js';

const recommendationRouter = express.Router();

recommendationRouter.post('/', recommendationController.postRecommendation);

recommendationRouter.post('/:id/upvote', recommendationController.upvote);

recommendationRouter.post('/:id/downvote', recommendationController.downvote);

recommendationRouter.get('/top/:amount', recommendationController.getTopAmount);

recommendationRouter.get(
	'/random',
	recommendationController.getRandomRecommendation
);

export default recommendationRouter;
