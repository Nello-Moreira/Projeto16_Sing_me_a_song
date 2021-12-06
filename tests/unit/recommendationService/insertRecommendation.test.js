import getYouTubeID from 'get-youtube-id';
import recommendation from '../../../src/services/recommendation.js';
import genre from '../../../src/services/genre.js';
import recommendationRepository from '../../../src/repositories/recommendation.js';
import ConflictError from '../../../src/errors/Conflict.js';
import BadRequestError from '../../../src/errors/BadRequest.js';

jest.mock('get-youtube-id');

describe('Tests for insert recommendation', () => {
	const allGenres = [
		{ id: 1, name: 'name1' },
		{ id: 2, name: 'name2' },
		{ id: 3, name: 'name3' },
	];

	const newRecommendation = {
		name: 'recommendation',
		youtubeLink: 'some link',
		genresIds: [1, 2],
	};

	const invalidGenreIdRecommendation = {
		name: 'recommendation',
		youtubeLink: 'some link',
		genresIds: [0],
	};

	it('should throw badRequestError when it is an invalid youtube id', async () => {
		getYouTubeID.mockImplementationOnce(() => false);

		const errorPromise = recommendation.insertRecommendation(newRecommendation);

		await expect(errorPromise).rejects.toThrowError(BadRequestError);
	});

	it('should throw badRequestError when an invalid genre id is provided', async () => {
		getYouTubeID.mockImplementationOnce(() => true);

		jest
			.spyOn(genre, 'searchAllGenres')
			.mockImplementationOnce(() => allGenres);

		const errorPromise = recommendation.insertRecommendation(
			invalidGenreIdRecommendation
		);

		await expect(errorPromise).rejects.toThrowError(BadRequestError);
	});

	it('should throw ConflictError when a repeated video is provided', async () => {
		getYouTubeID.mockImplementationOnce(() => true);

		jest
			.spyOn(genre, 'searchAllGenres')
			.mockImplementationOnce(() => allGenres);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationByParameter')
			.mockImplementationOnce(() => [true]);

		const errorPromise = recommendation.insertRecommendation(newRecommendation);

		await expect(errorPromise).rejects.toThrowError(ConflictError);
	});

	it('should throw ConflictError when a repeated video is provided', async () => {
		getYouTubeID.mockImplementationOnce(() => true);

		jest
			.spyOn(genre, 'searchAllGenres')
			.mockImplementationOnce(() => allGenres);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationByParameter')
			.mockImplementationOnce(() => []);

		jest
			.spyOn(recommendationRepository, 'insertRecommendation')
			.mockImplementationOnce(() => 1);

		jest
			.spyOn(recommendationRepository, 'insertRecommendationGenres')
			.mockImplementationOnce(() => true);

		const result = await recommendation.insertRecommendation(newRecommendation);

		expect(result).toBe(1);
	});
});
