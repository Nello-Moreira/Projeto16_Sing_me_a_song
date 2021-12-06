import recomendation from '../../../src/services/recomendation.js';

describe('Tests for upvote function', () => {
	const recomendationId = 1;

	it('should call vote with score = song.score + 1', async () => {
		jest.spyOn(recomendation, 'getSong').mockReturnValue({
			score: 0,
		});

		jest.spyOn(recomendation, 'vote').mockImplementationOnce(() => {});

		const result = await recomendation.upvote({ recomendationId });

		expect(result).toBe(true);
		expect(recomendation.getSong).toHaveBeenCalled();
		expect(recomendation.vote).toHaveBeenCalledWith({
			recomendationId,
			newValue: 1,
		});
	});
});
