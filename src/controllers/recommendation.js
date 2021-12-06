import {
	isInvalidRecommendation,
	isInvalidRecommendationId,
	isInvalidAmount,
} from '../validation/recommendation.js';
import recommendationService from '../services/recommendation.js';
import BadRequestError from '../errors/BadRequest.js';
import ConflictError from '../errors/Conflict.js';
import statusCodes from '../helpers/statusCodes.js';
import NotFoundError from '../errors/NotFound.js';
import IdError from '../errors/IdError.js';
import NoContentError from '../errors/NoContent.js';

async function postRecommendation(request, response, next) {
	const recommendation = request.body;

	const recommendationError = isInvalidRecommendation(recommendation);

	if (recommendationError) {
		return response
			.status(statusCodes.badRequest)
			.send(recommendationError.message);
	}

	try {
		const recommendationId = await recommendationService.insertRecommendation(
			recommendation
		);

		return response.status(statusCodes.ok).send({ id: recommendationId });
	} catch (error) {
		if (error instanceof BadRequestError) {
			return response.status(statusCodes.badRequest).send(error.message);
		}

		if (error instanceof ConflictError) {
			return response.status(statusCodes.conflict).send(error.message);
		}

		return next(error);
	}
}

async function getRecommendationId(request) {
	const recommendationId = Number(request.params.id);

	const invalidId = isInvalidRecommendationId({ recommendationId });

	if (invalidId) {
		throw new IdError(invalidId.message);
	}

	return recommendationId;
}

async function upvote(request, response, next) {
	try {
		const recommendationId = await getRecommendationId(request);

		await recommendationService.upvote({ recommendationId });

		return response.sendStatus(statusCodes.ok);
	} catch (error) {
		if (error instanceof IdError) {
			return response.status(statusCodes.badRequest).send(error.message);
		}

		if (error instanceof NotFoundError) {
			return response.status(statusCodes.notFound).send(error.message);
		}

		return next(error);
	}
}

async function downvote(request, response, next) {
	try {
		const recommendationId = await getRecommendationId(request);

		await recommendationService.downvote({ recommendationId });

		return response.sendStatus(statusCodes.ok);
	} catch (error) {
		if (error instanceof IdError) {
			return response.status(statusCodes.badRequest).send(error.message);
		}

		if (error instanceof NotFoundError) {
			return response.status(statusCodes.notFound).send(error.message);
		}

		return next(error);
	}
}

async function getTopAmount(request, response, next) {
	const amount = Number(request.params.amount);

	const invalidAmount = isInvalidAmount({ amount });

	if (invalidAmount) {
		return response.status(statusCodes.badRequest).send(invalidAmount.message);
	}

	try {
		const result = await recommendationService.getTopAmount({ amount });

		return response.status(statusCodes.ok).send(result);
	} catch (error) {
		if (error instanceof NoContentError) {
			return response.sendStatus(statusCodes.noContent);
		}

		return next(error);
	}
}

async function getRandomRecommendation(request, response, next) {
	try {
		const result = await recommendationService.getRandomRecommendation();

		return response.status(statusCodes.ok).send(result);
	} catch (error) {
		if (error instanceof NoContentError) {
			return response.sendStatus(statusCodes.noContent);
		}

		return next(error);
	}
}

export default {
	postRecommendation,
	upvote,
	downvote,
	getTopAmount,
	getRandomRecommendation,
};
