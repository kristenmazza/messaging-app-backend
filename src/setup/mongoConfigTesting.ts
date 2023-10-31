import mongoose, { Mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer | undefined;
let connection: Mongoose | undefined;

export const setUp = async (): Promise<void> => {
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();

  connection = await mongoose.connect(url, {});
};

export const dropDatabase = async (): Promise<void> => {
  if (mongo && connection) {
    await connection.connection.dropDatabase();
    await connection.connection.close();
    await mongo.stop();
  }
};

export const dropCollections = async (): Promise<void> => {
  if (mongo && connection) {
    const collections = connection.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
};
