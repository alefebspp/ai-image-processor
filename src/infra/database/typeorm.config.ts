import { DataSource } from 'typeorm';
import { Measurement } from '../../models/Measurement';
import { env } from '../../env';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

let isInitialized = false;

async function initializeDatabase() {
    if (isInitialized) {
        return;
    }

    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            await AppDataSource.initialize();
            isInitialized = true;
            console.log("Successfully connected to database");
            return;
        } catch (error) {
            console.error('Database connection failed, retrying...');
            retries++;
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }

    console.error('Unable to connect to the database after multiple attempts');
    process.exit(1);
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DATABASE_HOST,
    port: 5432,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    entities: [Measurement],
    synchronize: true,
    logging: false,
});

initializeDatabase();
