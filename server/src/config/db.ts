import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", async () => {
      console.log("MongoDB Connected");
    });
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017");
  } catch (error) {
    console.error("Error",error)
    process.exit(1)
  }
};
export default connectDB;
