import genresRepository from '../repositories/genre.js';
import NoContentError from '../errors/NoContent.js';
import ConflictError from '../errors/Conflict.js';
import NotFoundError from '../errors/NotFound.js';

async function searchAllGenres() {
	const genres = await genresRepository.searchAllGenres();

	if (genres.length === 0) {
		throw new NoContentError('Não há gêneros a serem exibidos');
	}

	return genres;
}

async function insertGenre({ genreName }) {
	const allGenres = await searchAllGenres();

	// prettier-ignore
	const repeatedGenre = allGenres
		.filter((genre) => genre.name === genreName)
		.length > 0;

	if (repeatedGenre) {
		throw new ConflictError('This genre already exists');
	}

	const genreId = await genresRepository.insertGenre({ genreName });

	return genreId;
}

async function searchGenre({ id }) {
	const allGenres = await searchAllGenres();

	// prettier-ignore
	const existingGenre = allGenres
		.filter((genre) => genre.id === id)
		.length > 0;

	if (!existingGenre) {
		throw new NotFoundError('Genre id must be an existing id');
	}
}

export default { searchGenre, searchAllGenres, insertGenre };
