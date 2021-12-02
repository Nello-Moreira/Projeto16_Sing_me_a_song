import genresRepository from '../repositories/genre.js';
import NoContent from '../errors/NoContent.js';

async function searchAllGenres() {
	const genres = await genresRepository.searchAllGenres();

	if (genres.length === 0) {
		throw new NoContent('Não há gêneros a serem exibidos');
	}

	return genres;
}

export default { searchAllGenres };
