import "reflect-metadata"
import app from './app';
import './infra/database/typeorm.config'


const start = async () => {
  try {
    await app.listen({ port: 8080 , host: "0.0.0.0"});
    console.log('Server listening on http://localhost:8080');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();