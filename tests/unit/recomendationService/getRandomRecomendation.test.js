import recomendation from '../../../src/services/recomendation.js';
import recomendationRepository from '../../../src/repositories/recomendation.js';
import createRandomInteger from '../../../src/helpers/createRandomInteger.js';
import NoContentError from '../../../src/errors/NoContent.js';

jest.mock('../../../src/helpers/createRandomInteger.js');

describe('Tests for getRandomRecomendation function', () => {
	it('should return any recomendation for score limits => min < 10 and max < 10', async () => {
		const recomendations = ['something'];
		const limits = {
			min: 0,
			max: 1,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recomendation.getRandomRecomendation();

		expect(result).toEqual(recomendations[0]);
	});

	it('should return any recomendation for score limits => min = 10 and max = 10', async () => {
		const recomendations = ['something'];
		const limits = {
			min: 10,
			max: 10,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recomendation.getRandomRecomendation();

		expect(result).toEqual(recomendations[0]);
	});

	it('should return any recomendation for score limits => min > 10 and max > 10', async () => {
		const recomendations = ['something'];
		const limits = {
			min: 15,
			max: 15,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recomendation.getRandomRecomendation();

		expect(result).toEqual(recomendations[0]);
	});

	it('should throw NoContentError for score limits => min < 10 and max < 10 and there is no song at database', async () => {
		const recomendations = [];
		const limits = {
			min: 0,
			max: 1,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockReturnValue(recomendations);

		const errorPromise = recomendation.getRandomRecomendation();

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});

	it('should return a recomendation with score less then 10 for limits min < 10 and max > 10 and random number < 0.3 ', async () => {
		const recomendations = ['something else'];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.29);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationsByFilter')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recomendation.getRandomRecomendation();

		expect(result).toEqual(recomendations[0]);
		expect(
			recomendationRepository.searchRecomendationsByFilter
		).toHaveBeenCalledWith({
			filter: 'songs.score <= 10',
		});
	});

	it('should throw NoContentError for limits min < 10 and max > 10, random number < 0.3 and there is no song at database', async () => {
		const recomendations = [];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.29);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationsByFilter')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const errorPromise = recomendation.getRandomRecomendation();

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});

	it('should return a recomendation with score greater then 10 for limits min < 10 and max > 10 and random number = 0.3 ', async () => {
		const recomendations = ['something else'];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.3);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationsByFilter')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recomendation.getRandomRecomendation();

		expect(result).toEqual(recomendations[0]);
		expect(
			recomendationRepository.searchRecomendationsByFilter
		).toHaveBeenCalledWith({
			filter: 'songs.score > 10',
		});
	});

	it('should return a recomendation with score greater then 10 for limits min < 10 and max > 10 and random number > 0.3 ', async () => {
		const recomendations = ['something else'];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.31);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationsByFilter')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recomendation.getRandomRecomendation();

		expect(result).toEqual(recomendations[0]);
		expect(
			recomendationRepository.searchRecomendationsByFilter
		).toHaveBeenCalledWith({
			filter: 'songs.score > 10',
		});
	});

	it('should throw NoContentError for limits min < 10 and max > 10, random number > 0.3 and there is no song at database', async () => {
		const recomendations = [];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recomendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recomendationRepository, 'searchAllRecomendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.31);

		jest
			.spyOn(recomendationRepository, 'searchRecomendationsByFilter')
			.mockReturnValue(recomendations);

		createRandomInteger.mockReturnValue(0);

		const errorPromise = recomendation.getRandomRecomendation();

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});
});
