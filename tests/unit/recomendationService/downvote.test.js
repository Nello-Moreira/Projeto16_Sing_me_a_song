import recomendation from '../../../src/services/recomendation.js';
import recomendationRepository from '../../../src/repositories/recomendation.js';

describe('Tests for downvote function', () => {
	const recomendationId = 1;

	it('should call vote with score = song.score - 1 for song scores above -5 and return true', async () => {
		jest.spyOn(recomendation, 'getSong').mockReturnValue({
			score: 1,
		});

		jest.spyOn(recomendation, 'vote').mockImplementationOnce(() => {});

		const result = await recomendation.downvote({ recomendationId });

		expect(result).toBe(true);
		expect(recomendation.getSong).toHaveBeenCalledWith({ recomendationId });
		expect(recomendation.vote).toHaveBeenCalledWith({
			recomendationId,
			newValue: 0,
		});
	});

	it('should delete recomendation when downvoted songs has score = -5', async () => {
		jest.spyOn(recomendation, 'getSong').mockReturnValue({
			score: -5,
		});

		jest
			.spyOn(recomendationRepository, 'deleteRecomendation')
			.mockImplementationOnce(() => {});

		await recomendation.downvote({ recomendationId });

		expect(recomendation.getSong).toHaveBeenCalledWith({ recomendationId });
		expect(recomendationRepository.deleteRecomendation).toHaveBeenCalledWith({
			recomendationId,
		});
	});
});
