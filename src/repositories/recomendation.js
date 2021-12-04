import dbConnection from './connection.js';

async function searchAllRecomendations() {
	const queryResult = await dbConnection.query(
		`
		SELECT
			songs.*,
			array_agg('{"id": ' || genres.id || ', "name": "' || genres.name || '"}') as genres
		FROM songs
		JOIN songs_genres
			ON songs_genres.song_id = songs.id
		JOIN genres
			ON genres.id = songs_genres.genre_id
		GROUP BY songs.id
		ORDER BY songs.score DESC;
	`
	);

	const formattedResult = queryResult.rows.map((song) => ({
		...song,
		genres: song.genres.map((genreString) => JSON.parse(genreString)),
	}));

	return formattedResult;
}

async function searchRecomendationByParameter({ parameter, value }) {
	const recomendation = await dbConnection.query(
		`SELECT * FROM songs WHERE ${parameter} = $1;`,
		[value]
	);

	return recomendation.rows;
}

async function searchRecomendationsByFilter({ filter }) {
	let baseQuery = `
		SELECT
			songs.*,
			array_agg('{"id": ' || genres.id || ', "name": "' || genres.name || '"}') as genres
		FROM songs
		JOIN songs_genres
			ON songs_genres.song_id = songs.id
		JOIN genres
			ON genres.id = songs_genres.genre_id `;

	if (filter) {
		baseQuery += `WHERE ${filter}`;
	}

	baseQuery += `
		GROUP BY songs.id
		ORDER BY songs.score DESC ;
	`;

	let recomendations = await dbConnection.query(baseQuery);

	recomendations = recomendations.rows.map((song) => ({
		...song,
		genres: song.genres.map((genreString) => JSON.parse(genreString)),
	}));

	return recomendations;
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

async function searchTopAmount({ amount }) {
	const queryResult = await dbConnection.query(
		`
		SELECT
			songs.*,
			array_agg('{"id": ' || genres.id || ', "name": "' || genres.name || '"}') as genres
		FROM songs
		JOIN songs_genres
			ON songs_genres.song_id = songs.id
		JOIN genres
			ON genres.id = songs_genres.genre_id
		GROUP BY songs.id
		ORDER BY songs.score DESC
		LIMIT $1;
	`,
		[amount]
	);

	const formattedResult = queryResult.rows.map((song) => ({
		...song,
		genres: song.genres.map((genreString) => JSON.parse(genreString)),
	}));

	return formattedResult;
}

async function getScoreLimits() {
	const queryResult = await dbConnection.query(
		'SELECT MIN(score), MAX(score) FROM songs;'
	);

	return queryResult.rows[0];
}

export default {
	searchRecomendationsByFilter,
	searchAllRecomendations,
	searchRecomendationByParameter,
	searchTopAmount,
	insertRecomendation,
	insertRecomendationGenres,
	updateRecomendationValue,
	deleteRecomendation,
	getScoreLimits,
};
