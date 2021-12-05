import getYouTubeID from 'get-youtube-id';
import recomendation from '../../../src/services/recomendation.js';
import genre from '../../../src/services/genre.js';
import recomendationRepository from '../../../src/repositories/recomendation.js';
import ConflictError from '../../../src/errors/Conflict.js';
import BadRequestError from '../../../src/errors/BadRequest.js';

jest.mock('get-youtube-id');

describe('Tests for insert recomendation', () => {
	const allGenres = [
		{ id: 1, name: 'name1' },
		{ id: 2, name: 'name2' },
		{ id: 3, name: 'name3' },
	];

	const newRecomendation = {
		name: 'recomendation',
		youtubeLink: 'some link',
		genresIds: [1, 2],
	};

	const invalidGenreIdRecomendation = {
		name: 'recomendation',
		youtubeLink: 'some link',
		genresIds: [0],
	};

	it('should throw badRequestError when it is an invalid youtube id', async () => {
		getYouTubeID.mockImplementationOnce(() => false);

		const errorPromise = recomendation.insertRecomendation(newRecomendation);

		await expect(errorPromise).rejects.toThrowError(BadRequestError);
	});

	it('should throw badRequestError when an invalid genre id is provided', async () => {
		getYouTubeID.mockImplementationOnce(() => true);

		jest
			.spyOn(genre, 'searchAllGenres')
			.mockImplementationOnce(() => allGenres);

		const errorPromise = recomendation.insertRecomendation(
			invalidGenreIdRecomendation
		);

		await expect(errorPromise).rejects.toThrowError(BadRequestError);
	});

	it('should throw ConflictError when a repeated video is provided', async () => {
		getYouTubeID.mockImplementationOnce(() => true);

		jest
			.spyOn(genre, 'searchAllGenres')
			.mockImplementationOnce(() => allGenres);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationByParameter')
			.mockImplementationOnce(() => [true]);

		const errorPromise = recomendation.insertRecomendation(newRecomendation);

		await expect(errorPromise).rejects.toThrowError(ConflictError);
	});

	it('should throw ConflictError when a repeated video is provided', async () => {
		getYouTubeID.mockImplementationOnce(() => true);

		jest
			.spyOn(genre, 'searchAllGenres')
			.mockImplementationOnce(() => allGenres);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationByParameter')
			.mockImplementationOnce(() => []);

		jest
			.spyOn(recomendationRepository, 'insertRecomendation')
			.mockImplementationOnce(() => 1);

		jest
			.spyOn(recomendationRepository, 'insertRecomendationGenres')
			.mockImplementationOnce(() => true);

		const result = await recomendation.insertRecomendation(newRecomendation);

		expect(result).toBe(1);
	});
});
