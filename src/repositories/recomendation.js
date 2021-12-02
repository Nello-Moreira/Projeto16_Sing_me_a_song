import dbConnection from './connection.js';

async function insertRecomendation({ name, youtubeLink, score }) {
	const recomendation = await dbConnection.query(
		'INSERT INTO songs (name, youtube_link, score) VALUES ($1, $2, $3) RETURNING id;',
		[name, youtubeLink, score]
	);

	return recomendation.rows[0].id;
}

async function insertRecomendationGenres({ recomendationId, genresIds }) {
	const query = [];

	genresIds.forEach((genreId) => {
		query.push(`(${recomendationId}, ${genreId})`);
	});

	await dbConnection.query(
		`INSERT INTO songs_genres
            (song_id, genre_id)
        VALUES
            ${query.join(',')};`
	);

	return true;
}

export default { insertRecomendation, insertRecomendationGenres };
