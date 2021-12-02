/* eslint no-console: 0 */
import server from './server.js';

const port = process.env.PORT;

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`Server running at ${process.env.NODE_ENV} mode`);
});
