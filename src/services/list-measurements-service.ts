import { AppError } from "../errors/AppError";
import MeasurementRepository from "../repositories/measurement-repository";


export class ListMeasurementsService {

    constructor(private measurementRepository: MeasurementRepository){}

    async list({customer_code, measure_type}: {customer_code: string; measure_type?: string}){
        if(measure_type){
            const measureTypeIsValid = measure_type == "WATER" || measure_type == "GAS"

            if(!measureTypeIsValid){
                throw new AppError({statusCode: 400, message: "Tipo de medição não permitida", errorCode: "INVALID_TYPE"})
            }
        }

        const measurements = await this.measurementRepository.list({customer_code, measure_type})
        
        if(measurements.length === 0){
            throw new AppError({statusCode: 404, message: "Nenhuma leitura encontrada", errorCode: "MEASURES_NOT_FOUND"})
        }

        return measurements
    }
}