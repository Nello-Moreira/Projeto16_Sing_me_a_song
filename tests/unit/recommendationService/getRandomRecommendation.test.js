import recommendation from '../../../src/services/recommendation.js';
import recommendationRepository from '../../../src/repositories/recommendation.js';
import createRandomInteger from '../../../src/helpers/createRandomInteger.js';
import NoContentError from '../../../src/errors/NoContent.js';

jest.mock('../../../src/helpers/createRandomInteger.js');

describe('Tests for getRandomRecommendation function', () => {
	it('should return any recommendation for score limits => min < 10 and max < 10', async () => {
		const recommendations = ['something'];
		const limits = {
			min: 0,
			max: 1,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recommendation.getRandomRecommendation();

		expect(result).toEqual(recommendations[0]);
	});

	it('should return any recommendation for score limits => min = 10 and max = 10', async () => {
		const recommendations = ['something'];
		const limits = {
			min: 10,
			max: 10,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recommendation.getRandomRecommendation();

		expect(result).toEqual(recommendations[0]);
	});

	it('should return any recommendation for score limits => min > 10 and max > 10', async () => {
		const recommendations = ['something'];
		const limits = {
			min: 15,
			max: 15,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recommendation.getRandomRecommendation();

		expect(result).toEqual(recommendations[0]);
	});

	it('should throw NoContentError for score limits => min < 10 and max < 10 and there is no song at database', async () => {
		const recommendations = [];
		const limits = {
			min: 0,
			max: 1,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockReturnValue(recommendations);

		const errorPromise = recommendation.getRandomRecommendation();

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});

	it('should return a recommendation with score less then 10 for limits min < 10 and max > 10 and random number < 0.3 ', async () => {
		const recommendations = ['something else'];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.29);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationsByFilter')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recommendation.getRandomRecommendation();

		expect(result).toEqual(recommendations[0]);
		expect(
			recommendationRepository.searchRecommendationsByFilter
		).toHaveBeenCalledWith({
			filter: 'songs.score <= 10',
		});
	});

	it('should throw NoContentError for limits min < 10 and max > 10, random number < 0.3 and there is no song at database', async () => {
		const recommendations = [];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.29);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationsByFilter')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const errorPromise = recommendation.getRandomRecommendation();

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});

	it('should return a recommendation with score greater then 10 for limits min < 10 and max > 10 and random number = 0.3 ', async () => {
		const recommendations = ['something else'];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.3);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationsByFilter')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recommendation.getRandomRecommendation();

		expect(result).toEqual(recommendations[0]);
		expect(
			recommendationRepository.searchRecommendationsByFilter
		).toHaveBeenCalledWith({
			filter: 'songs.score > 10',
		});
	});

	it('should return a recommendation with score greater then 10 for limits min < 10 and max > 10 and random number > 0.3 ', async () => {
		const recommendations = ['something else'];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.31);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationsByFilter')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const result = await recommendation.getRandomRecommendation();

		expect(result).toEqual(recommendations[0]);
		expect(
			recommendationRepository.searchRecommendationsByFilter
		).toHaveBeenCalledWith({
			filter: 'songs.score > 10',
		});
	});

	it('should throw NoContentError for limits min < 10 and max > 10, random number > 0.3 and there is no song at database', async () => {
		const recommendations = [];
		const limits = {
			min: 5,
			max: 15,
		};

		jest
			.spyOn(recommendationRepository, 'getScoreLimits')
			.mockReturnValue(limits);

		jest
			.spyOn(recommendationRepository, 'searchAllRecommendations')
			.mockImplementationOnce(() => {});

		jest.spyOn(Math, 'random').mockReturnValue(0.31);

		jest
			.spyOn(recommendationRepository, 'searchRecommendationsByFilter')
			.mockReturnValue(recommendations);

		createRandomInteger.mockReturnValue(0);

		const errorPromise = recommendation.getRandomRecommendation();

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});
});
