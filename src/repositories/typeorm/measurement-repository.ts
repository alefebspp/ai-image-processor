import { format, lastDayOfMonth } from "date-fns";
import { AppDataSource } from "../../infra/database/typeorm.config";
import { Measurement } from "../../models/Measurement";
import MeasurementRepository, {
  CreateMeasurementDTO,
} from "../measurement-repository";

export class TypeOrmMeasurementRepository implements MeasurementRepository {
  private measurementRepository = AppDataSource.getRepository(Measurement);

  async create(data: CreateMeasurementDTO) {
    const toBeSavedMeasurement = this.measurementRepository.create(data);
    
    const createdMeasurement = await this.measurementRepository.save(
      toBeSavedMeasurement
    );
    return createdMeasurement;
  }

  async findById(id: string) {

    const measurement = await this.measurementRepository.findOne({where: {
        measure_uuid: id
    }})

    return measurement
  }

  async existsInMonth(date: Date, measure_type: string) {
    const exists = await this.measurementRepository
      .createQueryBuilder("measurement")
      .where('measure_datetime >= :after', { after: format(date, 'yyyy-MM-01')})
      .andWhere('measure_datetime < :before', { before:  format(lastDayOfMonth(date), 'yyyy-MM-dd')
    })
    .andWhere("measure_type like :type", {type: measure_type})
    .getCount()

    return exists > 0;
  }

  async update(measurement: Measurement){
    await this.measurementRepository.save(measurement)
  }

  async list({customer_code, measure_type}: { customer_code: string; measure_type?: string | undefined; }) {
    const where = {
      customer_code
    }

    if(measure_type){
      Object.assign(where, {
        measure_type
      })
    }
    const measurements = await this.measurementRepository.find({where})

    return measurements
  }
}
