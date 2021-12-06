import recommendation from '../../../src/services/recommendation.js';

describe('Tests for upvote function', () => {
	const recommendationId = 1;

	it('should call vote with score = song.score + 1', async () => {
		jest.spyOn(recommendation, 'getSong').mockReturnValue({
			score: 0,
		});

		jest.spyOn(recommendation, 'vote').mockImplementationOnce(() => {});

		const result = await recommendation.upvote({ recommendationId });

		expect(result).toBe(true);
		expect(recommendation.getSong).toHaveBeenCalledWith({ recommendationId });
		expect(recommendation.vote).toHaveBeenCalledWith({
			recommendationId,
			newValue: 1,
		});
	});
});
