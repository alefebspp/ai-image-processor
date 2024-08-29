import Fastify from 'fastify';
import "reflect-metadata"
import { AppError } from './domain/errors/AppError';
import server from './server';
import '../src/infra/database/typeorm.config'


const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();