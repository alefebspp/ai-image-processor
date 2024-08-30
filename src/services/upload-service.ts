import path from "path";
import fs from 'fs';
import { AppError } from "../errors/AppError";
import MeasurementRepository, { CreateMeasurementDTO } from "../repositories/measurement-repository";
import { GoogleGenAiService } from "./google-gen-ai-service";
import { env } from "../env";


export class UploadService {

    constructor(private measurementRepository: MeasurementRepository){}

    async upload(data: CreateMeasurementDTO){

        if(!this.isValidBase64(data.image_url)){
            throw new AppError({statusCode: 400, message: "Invalid image base64 format"})
        }

        const alreadyExistsInMonth = await this.measurementRepository.existsInMonth(data.measure_datetime, data.measure_type)

        if(alreadyExistsInMonth){
            throw new AppError({statusCode: 409, message: "Leitura do mês já realizada", errorCode: "DOUBLE_REPORT"})
        }

        const temporaryImageName = `${data.measure_datetime.toISOString()}-${data.measure_type}`

        const {imageName, mimeType} = await this.formatAndStoreBase64(data.image_url, temporaryImageName)

        const imageService = new GoogleGenAiService()

        const measureValue = await imageService.analizeImage({imageName, mimeType})

        const imageUrl = env.API_URL + `/images/${imageName}`

        const measurement = await this.measurementRepository.create({...data, image_url: imageUrl})

        return {
            measurement,
            measureValue,
        }
    }

    private async formatAndStoreBase64(base64: string, temporaryImageName: string){
        try {
            const match = base64.match(/^data:(.+);base64,/);

        if(!match){
            throw new AppError({statusCode: 400, message: "Error trying to convert base64 to image"})
        }

        const mimeType = match[1]

        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

        const imageBuffer = Buffer.from(base64Data, 'base64'); 

        const format = mimeType.split('/')[1];

        const imageName = `${temporaryImageName}.${format}`;

        const imagePath = path.join(__dirname, '../temp', imageName);

        await fs.promises.writeFile(imagePath, imageBuffer);

        return {
            imageName,
            mimeType
        }

        } catch (error) {
            throw new AppError({statusCode: 400, message: "Error trying to convert base64 to image"})
        }
    }

    private isValidBase64(base64: string){
        const base64Regex = /^data:image\/([a-zA-Z]+);base64,/;
        
        return base64Regex.test(base64);      
    }
}