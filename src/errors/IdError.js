export default class IdError extends Error {
	constructor(message) {
		super(message);
		this.name = 'IdError';
	}
}
