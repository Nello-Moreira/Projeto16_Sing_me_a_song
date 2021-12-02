import pg from 'pg';

const { Pool } = pg;

function createConfig() {
	if (process.env.NODE_ENV === 'production') {
		return {
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
		};
	}
	return {
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
	};
}

const dbConnection = new Pool(createConfig());

export default dbConnection;
