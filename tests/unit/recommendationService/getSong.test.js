import recommendation from '../../../src/services/recommendation.js';
import recommendationRepository from '../../../src/repositories/recommendation.js';
import NotFoundError from '../../../src/errors/NotFound.js';

describe('Tests for get Song function', () => {
	const recommendationId = 1;

	it('should throw NotFoundError when there is no recommendation with provided id', async () => {
		jest
			.spyOn(recommendationRepository, 'searchRecommendationByParameter')
			.mockImplementationOnce(() => []);

		const errorPromise = recommendation.getSong({ recommendationId });

		await expect(errorPromise).rejects.toThrowError(NotFoundError);
	});

	it('should return mocked value when recommendation id is correct', async () => {
		jest
			.spyOn(recommendationRepository, 'searchRecommendationByParameter')
			.mockImplementationOnce(() => [true]);

		const result = await recommendation.getSong({ recommendationId });

		expect(result).toBe(true);
	});
});
