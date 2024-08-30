import { Measurement } from "../models/Measurement";

export interface CreateMeasurementDTO {
    image_url: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: "WATER" | "GAS";
}

export default interface MeasurementRepository {
    create: (data: CreateMeasurementDTO) => Promise<Measurement>
    findById: (id: string) => Promise<Measurement | null>
    existsInMonth: (date: Date, measure_type: string) => Promise<boolean>
    update: (measurement: Measurement) => Promise<void>
    list: (params: {customer_code: string; measure_type?: string}) => Promise<Measurement[]>
}