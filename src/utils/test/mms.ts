import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongoServer = new MongoMemoryServer();

export const dbConnect = async () => {
  const uri = mongoServer.getUri();
    console.log(uri);
    
  await mongoose.connect(uri);
};

export const dbDisConnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
