import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not defined in .env');

const client = new MongoClient(url);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('blog_system');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

const db = connectDB();
export default db;