import {
	getDatabaseName,
	getUsername,
	getPassword,
	createDatabase,
	createRoleScript,
} from './setup/databaseSetup.js';

import { createEnvs } from './setup/envSetup.js';

const mainFunction = () => {
	const databaseName = getDatabaseName();
	const username = getUsername();
	const password = getPassword();

	console.log('Creating envs files');
	createEnvs({ username, password, databaseName });

	console.log('Creating sql scripts');
	createRoleScript({ username, password });

	console.log('Creating database');
	createDatabase(databaseName);
};

mainFunction();
