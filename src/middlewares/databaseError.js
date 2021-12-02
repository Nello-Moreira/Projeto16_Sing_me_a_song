/* eslint-disable no-console */
export default function databaseErrorMiddleware(
	error,
	request,
	response,
	// eslint-disable-next-line no-unused-vars
	next
) {
	console.error(error);
	return response.sendStatus(500);
}
