import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {toZonedTime} from 'date-fns-tz'
import { UploadService } from "../../services/upload-service";
import { ConfirmService } from "../../services/confirm-service";
import { ListMeasurementsService } from "../../services/list-measurements-service";
import MeasurementRepository from "../../repositories/measurement-repository";
import { TypeOrmMeasurementRepository } from "../../repositories/typeorm/measurement-repository";

const uploadBody = z.object({
    image: z.string(),
    customer_code: z.string(),
    measure_datetime: z.string().datetime(),
    measure_type: z.enum(["WATER", "GAS"])
})

const confirmBody = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number().int()
})

const listParam = z.object({
  customer_code: z.string(),
})

const listQueries = z.object({
  measure_type: z.string().optional()
})

export class MeasurementController {

  private measurementRepository: MeasurementRepository;
  private uploadService: UploadService;
  private confirmService: ConfirmService;
  private listMeasurementsService: ListMeasurementsService

  constructor() {
      this.measurementRepository = new TypeOrmMeasurementRepository();
      this.uploadService = new UploadService(this.measurementRepository);
      this.confirmService = new ConfirmService(this.measurementRepository);
      this.listMeasurementsService = new ListMeasurementsService(this.measurementRepository)
  }

  upload = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = uploadBody.parse(request.body)

    const formattedBody = {
      ...body,
      image_url: body.image,
      measure_datetime: toZonedTime(body.measure_datetime, "UTC")
    }

    const {measurement, measureValue} = await this.uploadService.upload(formattedBody)

    return reply.code(200).send({ image_url: measurement.image_url, measure_value: measureValue, measure_uuid: measurement.measure_uuid });
  }

  confirm = async(request: FastifyRequest, reply: FastifyReply) => {
    const body = confirmBody.parse(request.body)

    await this.confirmService.confirm(body)

    return reply.code(200).send({success: true})
  }

  list = async(request: FastifyRequest, reply: FastifyReply) => {
    const {customer_code} = listParam.parse(request.params)
    const {measure_type} = listQueries.parse(request.query)

    const params = {
      customer_code
    }

    if(measure_type){
      Object.assign(params, {
        measure_type
      })
    }

    const measurements = await this.listMeasurementsService.list(params)

    return reply.code(200).send({customer_code, measures: measurements})
  }
}
