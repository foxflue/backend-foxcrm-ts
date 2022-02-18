import mongoose from "mongoose";

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};
