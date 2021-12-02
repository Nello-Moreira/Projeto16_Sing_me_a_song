import exampleRepository from '../repositories/example.js';
import exampleError from '../errors/example.js';

async function searchExamples() {
	const examples = await exampleRepository.searchAllExamples();

	if (examples.length === 0) {
		throw exampleError;
	}

	return examples;
}

export default { searchExamples };
