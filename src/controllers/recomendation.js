import { isInvalidRecomendation } from '../validation/recomendation.js';
import recomendationService from '../services/recomendation.js';
import BadRequestError from '../errors/BadRequest.js';
import ConflictError from '../errors/Conflict.js';
import statusCodes from '../helpers/statusCodes.js';

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

		return response.sendStatus(statusCodes.created);
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

export default { postRecomendation };
