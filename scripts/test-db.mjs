import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing MongoDB Connection...');
    console.log('URI Presence:', uri ? 'Yes' : 'No');

    if (!uri) {
        console.error('MONGODB_URI is missing in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected Successfully!');

        const admin = mongoose.connection.db.admin();
        const info = await admin.serverStatus();
        console.log('Server Version:', info.version);
        console.log('Database Name:', mongoose.connection.db.databaseName);

        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (err) {
        console.error('❌ Connection Failed:');
        console.error(err);
        process.exit(1);
    }
}

testConnection();
