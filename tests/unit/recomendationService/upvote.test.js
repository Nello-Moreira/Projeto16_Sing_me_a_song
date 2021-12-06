import recomendation from '../../../src/services/recomendation.js';
import recomendationRepository from '../../../src/repositories/recomendation.js';

describe('Tests for upvote function', () => {
	const recomendationId = 1;

	it('should throw NotFoundError when there is no recomendation with provided id', async () => {
		jest
			.spyOn(recomendationRepository, 'searchRecomendationByParameter')
			.mockImplementationOnce(() => [
				{
					score: 0,
				},
			]);

		jest
			.spyOn(recomendationRepository, 'updateRecomendationValue')
			.mockImplementationOnce(() => {});

		const result = await recomendation.upvote({ recomendationId });

		expect(result).toBe(true);
		expect(
			recomendationRepository.searchRecomendationByParameter
		).toHaveBeenCalled();
		expect(recomendationRepository.updateRecomendationValue).toHaveBeenCalled();
	});
});
