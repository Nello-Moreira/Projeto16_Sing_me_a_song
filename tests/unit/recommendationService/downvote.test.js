import recommendation from '../../../src/services/recommendation.js';
import recommendationRepository from '../../../src/repositories/recommendation.js';

describe('Tests for downvote function', () => {
	const recommendationId = 1;

	it('should call vote with score = song.score - 1 for song scores above -5 and return true', async () => {
		jest.spyOn(recommendation, 'getSong').mockReturnValue({
			score: 1,
		});

		jest.spyOn(recommendation, 'vote').mockImplementationOnce(() => {});

		const result = await recommendation.downvote({ recommendationId });

		expect(result).toBe(true);
		expect(recommendation.getSong).toHaveBeenCalledWith({ recommendationId });
		expect(recommendation.vote).toHaveBeenCalledWith({
			recommendationId,
			newValue: 0,
		});
	});

	it('should delete recommendation when downvoted songs has score = -5', async () => {
		jest.spyOn(recommendation, 'getSong').mockReturnValue({
			score: -5,
		});

		jest
			.spyOn(recommendationRepository, 'deleteRecommendation')
			.mockImplementationOnce(() => {});

		await recommendation.downvote({ recommendationId });

		expect(recommendation.getSong).toHaveBeenCalledWith({ recommendationId });
		expect(recommendationRepository.deleteRecommendation).toHaveBeenCalledWith({
			recommendationId,
		});
	});
});
