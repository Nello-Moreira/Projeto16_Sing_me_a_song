import genresService from '../services/genre.js';
import NoContent from '../errors/NoContent.js';
import { isInvalidGenreName } from '../validation/genre.js';

async function getAllGenres(request, response, next) {
	try {
		const genres = await genresService.searchAllGenres();

		return response.status(200).send(genres);
	} catch (error) {
		if (error instanceof NoContent) {
			return response.sendStatus(204);
		}

		return next(error);
	}
}

async function postGenre(request, response, next) {
	const { name } = request.body;

	const genreNameError = isInvalidGenreName({ name });

	if (genreNameError) {
		return response.status(400).send(genreNameError.message);
	}

	try {
		const genreId = await genresService.insertGenre({ genreName: name });

		return response.status(201).send({ id: genreId });
	} catch (error) {
		return next(error);
	}
}

export default { getAllGenres, postGenre };
