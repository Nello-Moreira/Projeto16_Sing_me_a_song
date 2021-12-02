import genresService from '../services/genre.js';
import NoContent from '../errors/NoContent.js';
import Conflict from '../errors/Conflict.js';
import { isInvalidGenreName } from '../validation/genre.js';
import statusCodes from '../helpers/statusCodes.js';

async function getAllGenres(request, response, next) {
	try {
		const genres = await genresService.searchAllGenres();

		return response.status(statusCodes.ok).send(genres);
	} catch (error) {
		if (error instanceof NoContent) {
			return response.sendStatus(statusCodes.noContent);
		}

		return next(error);
	}
}

async function postGenre(request, response, next) {
	const { name } = request.body;

	const genreNameError = isInvalidGenreName({ name });

	if (genreNameError) {
		return response.status(statusCodes.badRequest).send(genreNameError.message);
	}

	try {
		const genreId = await genresService.insertGenre({ genreName: name });

		return response.status(statusCodes.created).send({ id: genreId });
	} catch (error) {
		if (error instanceof Conflict) {
			return response.status(statusCodes.conflict).send(error.message);
		}

		return next(error);
	}
}

export default { getAllGenres, postGenre };
