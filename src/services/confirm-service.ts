import { AppError } from "../errors/AppError";
import MeasurementRepository from "../repositories/measurement-repository";


export class ConfirmService {

    constructor(private measurementRepository: MeasurementRepository){}

    async confirm({measure_uuid, confirmed_value}: {measure_uuid: string; confirmed_value: number}){

        const targetMeasurement = await this.measurementRepository.findById(measure_uuid)

        if(!targetMeasurement){
            throw new AppError({statusCode: 404, message: "Leitura do mês já realizada", errorCode: "MEASURE_NOT_FOUND"})
        }

        if(targetMeasurement.confirmed){
            throw new AppError({statusCode: 409, message: "Leitura do mês já realizada", errorCode: "CONFIRMATION_DUPLICATE"})
        }

        targetMeasurement.confirmed = true
        
        targetMeasurement.confirmed_value = confirmed_value

        await this.measurementRepository.update(targetMeasurement)
    }

}