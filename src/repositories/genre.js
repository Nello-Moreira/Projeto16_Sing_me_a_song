import dbConnection from './connection.js';

async function searchAllGenres() {
	const genres = await dbConnection.query(
		'SELECT * FROM genres ORDER BY name;'
	);
	return genres.rows;
}

async function insertGenre({ genreName }) {
	const genre = await dbConnection.query(
		'INSERT INTO genres (name) VALUES ($1) RETURNING id;',
		[genreName]
	);
	return genre.rows[0].id;
}

export default { searchAllGenres, insertGenre };
