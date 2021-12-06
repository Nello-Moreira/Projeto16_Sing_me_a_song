import recomendation from '../../../src/services/recomendation.js';
import recomendationRepository from '../../../src/repositories/recomendation.js';
import NoContentError from '../../../src/errors/NoContent.js';

describe('Tests for getTopAmount function', () => {
	const amount = 1;

	it('should throw NoContentError if there is no recomendation', async () => {
		jest.spyOn(recomendationRepository, 'searchTopAmount').mockReturnValue([]);

		const errorPromise = recomendation.getTopAmount({ amount });

		await expect(errorPromise).rejects.toThrowError(NoContentError);
	});

	it('should return top recomendations', async () => {
		const recomendations = ['something'];

		jest
			.spyOn(recomendationRepository, 'searchTopAmount')
			.mockReturnValue(recomendations);

		const result = await recomendation.getTopAmount({ amount });

		expect(result).toEqual(recomendations);
	});
});
