import mongoose from "mongoose";
import "dotenv/config"
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", async () => {
      console.log("MongoDB Connected");
    });
    
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.error("Error",error)
    process.exit(1)
  }
};
export default connectDB;
