import getYouTubeID from 'get-youtube-id';
import recommendationRepository from '../repositories/recommendation.js';
import genreService from './genre.js';
import BadRequestError from '../errors/BadRequest.js';
import ConflictError from '../errors/Conflict.js';
import NotFoundError from '../errors/NotFound.js';
import NoContentError from '../errors/NoContent.js';
import createRandomInteger from '../helpers/createRandomInteger.js';

const recommendation = {};

recommendation.insertRecommendation = async function insertRecommendation({
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
	const repeatedVideo = (await recommendationRepository
		.searchRecommendationByParameter({
			parameter: 'youtube_link',
			value: youtubeLink,
		}))
		.length > 0;

	if (repeatedVideo) {
		throw new ConflictError('This video already exists');
	}

	const recommendationId = await recommendationRepository.insertRecommendation({
		name,
		youtubeLink,
		score: 0,
	});

	await recommendationRepository.insertRecommendationGenres({
		recommendationId,
		genresIds,
	});

	return recommendationId;
};

recommendation.getSong = async function getSong({ recommendationId }) {
	// prettier-ignore
	const songsArray = await recommendationRepository
		.searchRecommendationByParameter(
			{
				parameter: 'id',
				value: recommendationId,
			}
		);

	const song = songsArray[0];

	if (!song) {
		throw new NotFoundError('There is no song with this id');
	}

	return song;
};

recommendation.vote = async function vote({ recommendationId, newValue }) {
	return recommendationRepository.updateRecommendationValue({
		recommendationId,
		newValue,
	});
};

recommendation.upvote = async function upvote({ recommendationId }) {
	const song = await recommendation.getSong({ recommendationId });

	await recommendation.vote({
		recommendationId,
		newValue: song.score + 1,
	});

	return true;
};

recommendation.downvote = async function downvote({ recommendationId }) {
	const song = await recommendation.getSong({ recommendationId });

	if (song.score === -5) {
		return recommendationRepository.deleteRecommendation({ recommendationId });
	}

	await recommendation.vote({
		recommendationId,
		newValue: song.score - 1,
	});

	return true;
};

recommendation.getTopAmount = async function getTopAmount({ amount }) {
	const topRecommendations = await recommendationRepository.searchTopAmount({
		amount,
	});

	if (topRecommendations.length === 0) {
		throw new NoContentError();
	}

	return topRecommendations;
};

recommendation.getRandomRecommendation =
	async function getRandomRecommendation() {
		let randomIndex;
		const { min, max } = await recommendationRepository.getScoreLimits();

		if (!(min < 10 && max > 10)) {
			// prettier-ignore
			const recommendations = await recommendationRepository.searchAllRecommendations();

			if (recommendations.length === 0) {
				throw new NoContentError();
			}

			randomIndex = createRandomInteger(0, recommendations.length);

			return recommendations[randomIndex];
		}

		const randomNumber = Math.random();

		if (randomNumber < 0.3) {
			const songsWithScoreLessThanTen =
				await recommendationRepository.searchRecommendationsByFilter({
					filter: 'songs.score <= 10',
				});

			if (songsWithScoreLessThanTen.length === 0) {
				throw new NoContentError();
			}

			randomIndex = createRandomInteger(0, songsWithScoreLessThanTen.length);

			return songsWithScoreLessThanTen[randomIndex];
		}

		const songsWithScoreGreaterThanTen =
			await recommendationRepository.searchRecommendationsByFilter({
				filter: 'songs.score > 10',
			});

		if (songsWithScoreGreaterThanTen.length === 0) {
			throw new NoContentError();
		}

		randomIndex = createRandomInteger(0, songsWithScoreGreaterThanTen.length);

		return songsWithScoreGreaterThanTen[randomIndex];
	};

export default recommendation;
