import recomendation from '../../../src/services/recomendation.js';
import recomendationRepository from '../../../src/repositories/recomendation.js';
import NotFoundError from '../../../src/errors/NotFound.js';

describe('Tests for get Song function', () => {
	const recomendationId = 1;

	it('should throw NotFoundError when there is no recomendation with provided id', async () => {
		jest
			.spyOn(recomendationRepository, 'searchRecomendationByParameter')
			.mockImplementationOnce(() => []);

		const errorPromise = recomendation.getSong({ recomendationId });

		await expect(errorPromise).rejects.toThrowError(NotFoundError);
	});

	it('should return mocked value when recomendation id is correct', async () => {
		jest
			.spyOn(recomendationRepository, 'searchRecomendationByParameter')
			.mockImplementationOnce(() => [true]);

		const result = await recomendation.getSong({ recomendationId });

		expect(result).toBe(true);
	});
});
