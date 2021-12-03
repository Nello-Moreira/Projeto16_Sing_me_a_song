import genresService from '../services/genre.js';
import NoContentError from '../errors/NoContent.js';
import ConflictError from '../errors/Conflict.js';
import NotFoundError from '../errors/NotFound.js';
import { isInvalidGenreName, isInvalidGenreId } from '../validation/genre.js';
import statusCodes from '../helpers/statusCodes.js';

async function getAllGenres(request, response, next) {
	try {
		const genres = await genresService.searchAllGenres();

		return response.status(statusCodes.ok).send(genres);
	} catch (error) {
		if (error instanceof NoContentError) {
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
		if (error instanceof ConflictError) {
			return response.status(statusCodes.conflict).send(error.message);
		}

		return next(error);
	}
}

async function getGenre(request, response, next) {
	const id = Number(request.params.id);

	const genreIdError = isInvalidGenreId({ id });

	if (genreIdError) {
		return response.status(statusCodes.badRequest).send(genreIdError.message);
	}

	try {
		const genre = await genresService.searchGenre({ id });

		return response.status(statusCodes.ok).send(genre);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return response.status(statusCodes.notFound).send(error.message);
		}

		return next(error);
	}
}

export default { getAllGenres, postGenre, getGenre };
