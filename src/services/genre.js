import genresRepository from '../repositories/genre.js';
import NoContentError from '../errors/NoContent.js';
import ConflictError from '../errors/Conflict.js';

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

export default { searchAllGenres, insertGenre };
