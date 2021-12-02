import dbConnection from './connection.js';

async function searchAllGenres() {
	const examples = await dbConnection.query(
		'SELECT * FROM genres ORDER BY name'
	);
	return examples.rows;
}

export default { searchAllGenres };
