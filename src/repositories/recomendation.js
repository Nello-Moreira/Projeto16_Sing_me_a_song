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
		WHERE id = $1;`,
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

function parseGenreString(genreString) {
	return JSON.parse(genreString);
}

const searchSongDefaultQuery = `
	SELECT
		songs.*,
		array_agg('{"id": ' || genres.id || ', "name": "' || genres.name || '"}') as genres
	FROM songs
	JOIN songs_genres
		ON songs_genres.song_id = songs.id
	JOIN genres
		ON genres.id = songs_genres.genre_id
	GROUP BY songs.id
`;

async function searchTopAmount({ amount }) {
	const queryResult = await dbConnection.query(
		`${searchSongDefaultQuery}
		ORDER BY songs.score DESC
		LIMIT $1;
	`,
		[amount]
	);

	const formattedResult = queryResult.rows.map((song) => ({
		...song,
		genres: song.genres.map((genreString) => parseGenreString(genreString)),
	}));

	return formattedResult;
}

export default {
	searchRecomendationByParameter,
	searchTopAmount,
	insertRecomendation,
	insertRecomendationGenres,
	updateRecomendationValue,
	deleteRecomendation,
};
