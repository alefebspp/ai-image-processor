import fs from 'fs'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../env";
import path from 'path';
import { AppError } from '../errors/AppError';


export class GoogleGenAiService {

    private genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    
    async analizeImage({mimeType, imageName}: {mimeType: string, imageName: string}){
       try {
        const  model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
          });

          const imagePath = path.join(__dirname, '../temp', imageName);

          const result = await model.generateContent([
            "Please locate the 'total to be paid' amount in the bill images. This amount usually appears at the bottom of the document and is preceded by phrases like 'Total to be paid,' 'Total amount,' 'Total due,' or 'Amount due'.Return only the value.",
            {
                inlineData: {
                  data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
                  mimeType
                },
            }
          ]);

          const measurementValue = result.response.text()
          return measurementValue
       } catch (error) {
         throw new AppError({message: "Gemini internal server error.Please, try again.", statusCode: 500})
       }
    }

}