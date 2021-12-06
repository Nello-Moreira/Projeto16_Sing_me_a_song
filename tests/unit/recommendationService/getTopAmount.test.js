import recommendation from '../../../src/services/recommendation.js';
import recommendationRepository from '../../../src/repositories/recommendation.js';
import NoContentError from '../../../src/errors/NoContent.js';

describe('Tests for getTopAmount function', () => {
	const amount = 1;

	it('should throw NoContentError if there is no recommendation', async () => {
		jest.spyOn(recommendationRepository, 'searchTopAmount').mockReturnValue([]);

		const errorPromise = recommendation.getTopAmount({ amount });

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});

	it('should return top recommendations', async () => {
		const recommendations = ['something'];

		jest
			.spyOn(recommendationRepository, 'searchTopAmount')
			.mockReturnValue(recommendations);

		const result = await recommendation.getTopAmount({ amount });

		expect(result).toEqual(recommendations);
	});
});
