export default class NoContentError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NoContentError';
	}
}
