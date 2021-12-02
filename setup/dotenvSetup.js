import dotenv from 'dotenv';

let path;

if (process.env.NODE_ENV === 'production') {
	path = '.env';
} else if (process.env.NODE_ENV === 'development') {
	path = '.development.env';
} else {
	path = '.test.env';
}

dotenv.config({
	path,
});
