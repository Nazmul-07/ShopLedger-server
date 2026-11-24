import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
    path: path.join(process.cwd(), '.env'),
})

const config = {
    port: process.env.PORT || 5000,
    db: process.env.DATABASE_URL
}

export default config;