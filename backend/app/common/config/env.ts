import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    PORT: z.string().default("8000").transform((p) => parseInt(p, 10)),
    BASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    FRONTEND_URL: z.string().url(),

    // JWT Configuration
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRE: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRE: z.string().min(1),

    // Email Configuration
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().transform((p) => parseInt(p, 10)),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM: z.string().email(),

    // Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_UPLOAD_FOLDER: z.string().min(1),
});

export const env = envSchema.parse(process.env);