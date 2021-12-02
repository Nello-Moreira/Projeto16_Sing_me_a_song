import { execFile } from 'child_process';
import readlineSync from 'readline-sync';
import fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const database_path =
	__dirname.split('/').slice(0, -1).join('/') + '/database_scripts';

const createDatabase = databaseName => {
	const writeDatabaseNameFile = databaseName => {
		try {
			fs.writeFileSync(
				`${database_path}/database_name.txt`,
				`${databaseName}`
			);
		} catch (error) {
			console.log(error);
		}
	};

	writeDatabaseNameFile(databaseName);
	execFile(`${database_path}/create-database.sh`);
};

const createRoleScript = ({ username, password }) => {
	try {
		fs.writeFileSync(
			`${database_path}/scripts/create-role.sql`,
			`DO\n$$\nBEGIN\n\tIF NOT EXISTS (\nSELECT FROM pg_catalog.pg_roles WHERE rolname='${username}'\n) THEN\nCREATE ROLE ${username} WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD '${password}';\nEND IF;\nEND\n$$;`
		);
	} catch (error) {
		console.log(error);
	}
};

const getDatabaseName = () =>
	readlineSync.question('Enter your database name: ');

const getUsername = () =>
	readlineSync.question('Enter your username for this database: ');

const getPassword = () => {
	let firstTry;
	let secondTry;

	while (true) {
		firstTry = readlineSync.question('Enter your password: ', {
			hideEchoBack: true,
		});

		secondTry = readlineSync.question('Enter your password: ', {
			hideEchoBack: true,
		});

		if (firstTry !== secondTry) {
			console.log(
				"The password you entered doesn't match. Please try again."
			);
		} else {
			return firstTry;
		}
	}
};

export {
	getDatabaseName,
	getUsername,
	getPassword,
	createDatabase,
	createRoleScript,
};
