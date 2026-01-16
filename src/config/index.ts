import { z } from 'zod';

const nodeEnv = z.object({ NODE_ENV: z.string().default('local') });
const { success : nodeEnvSuccess, error : nodeEnvError, data : nodeEnvData } = nodeEnv.safeParse(process.env);

if (!nodeEnvSuccess) {
    console.error('❌ Invalid NODE_ENV:', nodeEnvError.format());
    process.exit(1);
}

export const { NODE_ENV } = nodeEnvData;

const defaultValues = {
    API_ENDPOINT    : '',
    DB_URL          : '',
    DB_PASSWORD     : '',
    DB_NAME         : '',
    DB_USER         : '',
    JWT_SECRET      : '',
    JWT_EXPIRES_IN  : '1d',
    APPLICATION_URL : "http://localhost:3000/api",
    SWAGGER_URL     : "api/docs",
}

const envSchema = z.object({
    API_ENDPOINT    : z.string().url().default(defaultValues.API_ENDPOINT),
    DB_URL          : z.string().url().default(defaultValues.DB_URL),
    DB_PASSWORD     : z.string().default(defaultValues.DB_PASSWORD),
    DB_NAME         : z.string().default(defaultValues.DB_NAME),
    DB_USER         : z.string().default(defaultValues.DB_USER),
    JWT_SECRET      : z.string().default(defaultValues.JWT_SECRET),
    JWT_EXPIRES_IN  : z.string().default(defaultValues.JWT_EXPIRES_IN),
    APPLICATION_URL : z.string().url().default(defaultValues.APPLICATION_URL),
    SWAGGER_URL     : z.string().default(defaultValues.SWAGGER_URL),
});

const { success: envSuccess, error: envError, data: envData } = envSchema.safeParse(process.env);

if (!envSuccess) {
    console.error('❌ Invalid environment variables:', envError.format());
    process.exit(1);
}

export const {
    API_ENDPOINT,
    DB_URL,
    DB_PASSWORD,
    DB_NAME,
    DB_USER,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    APPLICATION_URL,
    SWAGGER_URL,
} = envData;
