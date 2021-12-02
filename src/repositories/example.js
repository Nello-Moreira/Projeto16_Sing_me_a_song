import dbConnection from './connection.js';

async function searchAllExamples() {
	const examples = await dbConnection.query('SELECT * FROM examples');
	return examples.rows;
}

export default { searchAllExamples };
