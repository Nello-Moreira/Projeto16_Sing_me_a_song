import getYouTubeID from 'get-youtube-id';
import recomendationRepository from '../repositories/recomendation.js';
import genreService from './genre.js';
import BadRequestError from '../errors/BadRequest.js';
import ConflictError from '../errors/Conflict.js';
import NotFoundError from '../errors/NotFound.js';
import NoContentError from '../errors/NoContent.js';
import createRandomInteger from '../helpers/createRandomInteger.js';

const recomendation = {};

recomendation.insertRecomendation = async function insertRecomendation({
	name,
	youtubeLink,
	genresIds,
}) {
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
};

recomendation.getSong = async function getSong({ recomendationId }) {
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
};

recomendation.vote = async function vote({ recomendationId, newValue }) {
	return recomendationRepository.updateRecomendationValue({
		recomendationId,
		newValue,
	});
};

recomendation.upvote = async function upvote({ recomendationId }) {
	const song = await recomendation.getSong({ recomendationId });

	await recomendation.vote({
		recomendationId,
		newValue: song.score + 1,
	});

	return true;
};

recomendation.downvote = async function downvote({ recomendationId }) {
	const song = await recomendation.getSong({ recomendationId });

	if (song.score === -5) {
		return recomendationRepository.deleteRecomendation({ recomendationId });
	}

	await recomendation.vote({
		recomendationId,
		newValue: song.score - 1,
	});

	return true;
};

recomendation.getTopAmount = async function getTopAmount({ amount }) {
	const topRecomendations = await recomendationRepository.searchTopAmount({
		amount,
	});

	if (topRecomendations.length === 0) {
		throw new NoContentError();
	}

	return topRecomendations;
};

recomendation.getRandomRecomendation = async function getRandomRecomendation() {
	let randomIndex;
	const { min, max } = await recomendationRepository.getScoreLimits();

	if (!(min < 10 && max > 10)) {
		// prettier-ignore
		const recomendations = await recomendationRepository.searchAllRecomendations();
		randomIndex = createRandomInteger(0, recomendations.length - 1);
		return recomendations[randomIndex];
	}

	const randomNumber = Math.random();

	if (randomNumber < 0.3) {
		const songsWithScoreLessThanTen =
			await recomendationRepository.searchRecomendationsByFilter({
				filter: 'songs.score <= 10',
			});

		randomIndex = createRandomInteger(0, songsWithScoreLessThanTen.length);

		return songsWithScoreLessThanTen[randomIndex];
	}

	const songsWithScoreGreaterThanTen =
		await recomendationRepository.searchRecomendationsByFilter({
			filter: 'songs.score > 10',
		});

	randomIndex = createRandomInteger(0, songsWithScoreGreaterThanTen.length);

	return songsWithScoreGreaterThanTen[randomIndex];
};

export default recomendation;
