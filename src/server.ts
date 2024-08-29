import Fastify from 'fastify';
import { AppDataSource } from './infra/database/typeorm.config';
import { Photo } from './domain/models/Photo';
import { AppError } from './domain/errors/AppError';

const server = Fastify();

server.get('/ping', async (request, reply) => {
    const photo = new Photo()
    photo.name = "Me and Bears"
    photo.description = "I am near polar bears"
    photo.filename = "photo-with-bears.jpg"
    photo.views = 1
    photo.isPublished = true

    const photoRepository = AppDataSource.getRepository(Photo)
    await photoRepository.save(photo)
    const savedPhotos = await photoRepository.find()

  return reply.code(200).send({ photos: savedPhotos});
});

server.setErrorHandler(function (error, request, reply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

   reply.status(500).send({ message: "Internal server error" })
})

export default server