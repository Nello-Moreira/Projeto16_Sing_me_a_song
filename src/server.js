import '../setup/dotenvSetup.js';
import express from 'express';
import cors from 'cors';

import databaseErrorMiddleware from './middlewares/databaseError.js';

import exampleRouter from './routers/example.js';

const server = express();
server.use(cors());
server.use(express.json());

server.use('/examples', exampleRouter);

server.use(databaseErrorMiddleware);

export default server;
