import express from 'express';
import example from '../controllers/example.js';

const exampleRouter = express.Router();

exampleRouter.get('/', example.getRoute);

export default exampleRouter;
