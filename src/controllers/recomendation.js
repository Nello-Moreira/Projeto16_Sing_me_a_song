import {
	isInvalidRecomendation,
	isInvalidRecomendationId,
} from '../validation/recomendation.js';
import recomendationService from '../services/recomendation.js';
import BadRequestError from '../errors/BadRequest.js';
import ConflictError from '../errors/Conflict.js';
import statusCodes from '../helpers/statusCodes.js';
import NotFoundError from '../errors/NotFound.js';
import IdError from '../errors/IdError.js';

async function postRecomendation(request, response, next) {
	const recomendation = request.body;

	const recomendationError = isInvalidRecomendation(recomendation);

	if (recomendationError) {
		return response
			.status(statusCodes.badRequest)
			.send(recomendationError.message);
	}

	try {
		const recomendationId = await recomendationService.insertRecomendation(
			recomendation
		);

		return response.status(statusCodes.ok).send({ id: recomendationId });
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

async function getRecomendationId(request) {
	const recomendationId = Number(request.params.id);

	const invalidId = isInvalidRecomendationId({ recomendationId });

	if (invalidId) {
		throw new IdError(invalidId.message);
	}

	return recomendationId;
}

async function upvote(request, response, next) {
	try {
		const recomendationId = await getRecomendationId(request);

		const voted = await recomendationService.upvote({ recomendationId });

		return response.status(statusCodes.ok).send(voted);
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
		const recomendationId = await getRecomendationId(request);

		await recomendationService.downvote({ recomendationId });

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

export default { postRecomendation, upvote, downvote };
