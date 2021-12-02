import genresService from '../services/genre.js';
import NoContent from '../errors/NoContent.js';

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

export default { getAllGenres };
