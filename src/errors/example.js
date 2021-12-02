export default class exampleError extends Error {
	constructor(message) {
		super(message);
		this.name = 'exampleError';
	}
}
