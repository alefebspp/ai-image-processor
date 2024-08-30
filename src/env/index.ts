import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
  API_URL: z.string(),
  DATABASE_HOST:z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD:z.string(),
  DATABASE_NAME:z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
