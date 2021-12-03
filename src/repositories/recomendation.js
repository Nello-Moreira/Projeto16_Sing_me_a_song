import dbConnection from './connection.js';

async function searchRecomendationByParameter({ parameter, value }) {
	const recomendation = await dbConnection.query(
		`SELECT * FROM songs WHERE ${parameter} = $1;`,
		[value]
	);

	return recomendation.rows;
}

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

async function updateRecomendationValue({ recomendationId, newValue }) {
	const updatedRecomendation = await dbConnection.query(
		`UPDATE songs
		SET score = $2
		WHERE id = $1
		RETURNING *;`,
		[recomendationId, newValue]
	);
	return updatedRecomendation.rows[0];
}

async function deleteRecomendationGenres({ recomendationId }) {
	await dbConnection.query('DELETE from songs_genres WHERE song_id = $1;', [
		recomendationId,
	]);

	return true;
}

async function deleteRecomendation({ recomendationId }) {
	await deleteRecomendationGenres({ recomendationId });

	await dbConnection.query('DELETE from songs WHERE id = $1;', [
		recomendationId,
	]);

	return true;
}

export default {
	searchRecomendationByParameter,
	insertRecomendation,
	insertRecomendationGenres,
	updateRecomendationValue,
	deleteRecomendation,
};
