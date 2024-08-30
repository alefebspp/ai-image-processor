import Fastify from 'fastify';
import path from 'path';
import { AppError } from './errors/AppError';
import measurementRoutes from './presentation/routes/measurement.routes';
import { ZodError } from 'zod';

const app = Fastify();

app.register(require('@fastify/static'), {
  root: path.join(__dirname, './temp'), 
  prefix: '/images/',
});

measurementRoutes(app)

app.setErrorHandler(function (error, request, reply) {
  if (error instanceof AppError) {
    const errorObject = {
      error_description: error.message,
    }

    if(error.errorCode){
      Object.assign(errorObject, {
        error_code: error.errorCode
      })
    }
    return reply.status(error.statusCode).send(errorObject)
  }
  
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error_code: "INVALID_DATA",
      error_description: "Os dados fornecidos no corpo da requisição são inválidos",
    });
  }
  console.log("ERROR:", error)
   reply.status(500).send({ message: "Internal server error" })
})

export default app