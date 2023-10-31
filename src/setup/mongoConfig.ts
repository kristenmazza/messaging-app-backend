import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

async function connectDatabase(): Promise<void> {
  const mongoDB = process.env.MONGODB_URI as string;
  if (process.env.NODE_ENV === 'test') {
    await mongoose.createConnection(mongoDB);
  } else {
    await mongoose.connect(mongoDB);
  }
}

export default async function initializeMongoDB() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error(error);
  }
}
