// /** @type {import('next').NextConfig} */
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();


const nextConfig = {
    env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MONGO_URL: process.env.MONGO_URL,
    NEXTAUTH_JWT_SECRET: process.env.NEXTAUTH_JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD,
  },
};

export default nextConfig;
