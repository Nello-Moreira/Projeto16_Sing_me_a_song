import exampleService from '../services/example.js';
import exampleError from '../errors/example.js';

async function getRoute(request, response, next) {
	try {
		// eslint-disable-next-line no-unused-vars
		const examples = await exampleService.searchExamples();

		return response.status(501).send('this is an example route');
	} catch (error) {
		if (error instanceof exampleError) {
			return response.sendStatus(204);
		}

		return next(error);
	}
}

export default { getRoute };
