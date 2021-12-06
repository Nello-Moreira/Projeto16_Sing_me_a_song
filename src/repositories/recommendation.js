import dbConnection from './connection.js';

async function searchAllRecommendations() {
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

async function searchRecommendationByParameter({ parameter, value }) {
	const recommendation = await dbConnection.query(
		`SELECT * FROM songs WHERE ${parameter} = $1;`,
		[value]
	);

	return recommendation.rows;
}

async function searchRecommendationsByFilter({ filter }) {
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

	let recommendations = await dbConnection.query(baseQuery);

	recommendations = recommendations.rows.map((song) => ({
		...song,
		genres: song.genres.map((genreString) => JSON.parse(genreString)),
	}));

	return recommendations;
}

async function insertRecommendation({ name, youtubeLink, score }) {
	const recommendation = await dbConnection.query(
		'INSERT INTO songs (name, youtube_link, score) VALUES ($1, $2, $3) RETURNING id;',
		[name, youtubeLink, score]
	);

	return recommendation.rows[0].id;
}

async function insertRecommendationGenres({ recommendationId, genresIds }) {
	const query = [];

	genresIds.forEach((genreId) => {
		query.push(`(${recommendationId}, ${genreId})`);
	});

	await dbConnection.query(
		`INSERT INTO songs_genres
            (song_id, genre_id)
        VALUES
            ${query.join(',')};`
	);

	return true;
}

async function updateRecommendationValue({ recommendationId, newValue }) {
	const updatedRecommendation = await dbConnection.query(
		`UPDATE songs
		SET score = $2
		WHERE id = $1;`,
		[recommendationId, newValue]
	);
	return updatedRecommendation.rows[0];
}

async function deleteRecommendationGenres({ recommendationId }) {
	await dbConnection.query('DELETE from songs_genres WHERE song_id = $1;', [
		recommendationId,
	]);

	return true;
}

async function deleteRecommendation({ recommendationId }) {
	await deleteRecommendationGenres({ recommendationId });

	await dbConnection.query('DELETE from songs WHERE id = $1;', [
		recommendationId,
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
	searchRecommendationsByFilter,
	searchAllRecommendations,
	searchRecommendationByParameter,
	searchTopAmount,
	insertRecommendation,
	insertRecommendationGenres,
	updateRecommendationValue,
	deleteRecommendation,
	getScoreLimits,
};
