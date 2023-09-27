import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes';

const server = express();

server.use(cors({
  origin: process.env.ENABLED?.split(';') || []
}));

server.use(express.json());

server.use(router);

export { server };
