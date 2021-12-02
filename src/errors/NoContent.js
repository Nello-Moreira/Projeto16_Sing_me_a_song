export default class NoContent extends Error {
	constructor(message) {
		super(message);
		this.name = 'NoContent';
	}
}
