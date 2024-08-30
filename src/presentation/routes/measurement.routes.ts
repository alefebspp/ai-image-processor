import { FastifyInstance } from "fastify";
import { MeasurementController } from "../controllers/measurement-controller";

const measurementController = new MeasurementController()

export default function measurementRoutes(instance: FastifyInstance){

    instance.post("/upload", measurementController.upload)
    instance.patch("/confirm", measurementController.confirm)
    instance.get("/:customer_code/list", measurementController.list)
}