import { DataSource } from "typeorm"
import { Photo } from "../../domain/models/Photo"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "user",
    database: "shopper",
    entities: [Photo],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
        console.log("Successfully connected to database")
    })
    .catch((error) => console.log(error))
