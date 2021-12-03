import getYouTubeID from 'get-youtube-id';
import recomendationRepository from '../repositories/recomendation.js';
import genreService from './genre.js';
import BadRequestError from '../errors/BadRequest.js';
import ConflictError from '../errors/Conflict.js';
import NotFoundError from '../errors/NotFound.js';

async function insertRecomendation({ name, youtubeLink, genresIds }) {
	const youtubeId = getYouTubeID(youtubeLink, { fuzzy: false });

	if (!youtubeId) {
		throw new BadRequestError('Invalid youtube link');
	}

	const allGenres = await genreService.searchAllGenres();
	const allGenresIds = allGenres.map((genre) => genre.id);

	genresIds.forEach((genreId) => {
		if (!allGenresIds.includes(genreId)) {
			throw new BadRequestError('All genre ids must be valid ids');
		}
	});

	// prettier-ignore
	const repeatedVideo = (await recomendationRepository
		.searchRecomendationByParameter({
			parameter: 'youtube_link',
			value: youtubeLink,
		}))
		.length > 0;

	if (repeatedVideo) {
		throw new ConflictError('This video already exists');
	}

	const recomendationId = await recomendationRepository.insertRecomendation({
		name,
		youtubeLink,
		score: 0,
	});

	await recomendationRepository.insertRecomendationGenres({
		recomendationId,
		genresIds,
	});

	return recomendationId;
}

async function getSong({ recomendationId }) {
	// prettier-ignore
	const songsArray = await recomendationRepository
		.searchRecomendationByParameter(
			{
				parameter: 'id',
				value: recomendationId,
			}
		);

	const song = songsArray[0];

	if (!song) {
		throw new NotFoundError('There is no song with this id');
	}

	return song;
}

async function vote({ recomendationId, newValue }) {
	return recomendationRepository.updateRecomendationValue({
		recomendationId,
		newValue,
	});
}

async function upvote({ recomendationId }) {
	const song = await getSong({ recomendationId });

	await vote({
		recomendationId,
		newValue: song.score + 1,
	});

	return true;
}

async function downvote({ recomendationId }) {
	const song = await getSong({ recomendationId });

	if (song.score === -5) {
		return recomendationRepository.deleteRecomendation({ recomendationId });
	}

	await vote({
		recomendationId,
		newValue: song.score - 1,
	});

	return true;
}

async function getTopAmount({ amount }) {
	return recomendationRepository.searchTopAmount({ amount });
}

export default {
	insertRecomendation,
	upvote,
	downvote,
	getTopAmount,
};
