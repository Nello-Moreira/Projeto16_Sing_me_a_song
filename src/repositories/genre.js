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

async function searchGenreWithRecommendations({ id }) {
	const genreQueryResult = await dbConnection.query(
		`
		SELECT * FROM genres WHERE id = $1;
		`,
		[id]
	);

	const genre = genreQueryResult.rows[0];

	const recommendationsQueryResult = await dbConnection.query(
		`
	SELECT songs.*,
		(
			SELECT array_agg('{"id": ' || genres.id || ', "name": "' || genres.name || '"}') as genres
			FROM genres
			JOIN songs_genres
				ON genres.id = songs_genres.genre_id
			WHERE songs_genres.song_id = songs.id
			GROUP BY songs_genres.song_id
		)
	FROM songs
	JOIN songs_genres
		ON songs_genres.song_id = songs.id
	WHERE songs_genres.genre_id = $1;
	`,
		[id]
	);

	const formattedRecommendations = recommendationsQueryResult.rows.map(
		(song) => ({
			...song,
			genres: song.genres.map((genreString) => JSON.parse(genreString)),
		})
	);

	const scores = formattedRecommendations.map(
		(recommendation) => recommendation.score
	);

	const genreScore = scores.reduce(
		(previousValue, currentValue) => previousValue + currentValue
	);

	genre.score = genreScore;
	genre.recommendations = formattedRecommendations;

	return genre;
}
export default { searchAllGenres, searchGenreWithRecommendations, insertGenre };
