import mongoose from "mongoose";

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("DB already Connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("DB Connected");
    // console.log(mongoose.connection.readyState);
  } catch (error) {
    console.log(error);
    console.log("DB not Connected");
    process.exit(1);
  }
};
