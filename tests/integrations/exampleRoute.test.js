import supertest from 'supertest';
import server from '../../src/server.js';

describe('Tests for get /examples', () => {
	it('should return something', async () => {
		const response = await supertest(server).get('/examples');
		expect(response.status).toBe(500);
	});
});
