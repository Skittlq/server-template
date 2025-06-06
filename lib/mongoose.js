import mongoose from "mongoose";
import "dotenv/config";
import isDev from "@/helper/isDev";
import env from "@/helper/envResolver";

const USE_TEST_DB = isDev();

const Test_URI = env("MONGO_TEST_URI");
const Prod_URI = env("MONGO_PROD_URI");

const connectDB = async () => {
  const databaseURI = USE_TEST_DB ? Test_URI : Prod_URI;
  const dbName = USE_TEST_DB ? env("MONGO_DB_NAME") : env("MONGO_DB_NAME");

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.useDb(dbName);
  }

  try {
    await mongoose.connect(databaseURI);
    console.log(`✅ Connected to ${mongoose.connection.name}`);
    return mongoose.connection.useDb(dbName);
  } catch (error) {
    console.error("⚠️ Error connecting to database:", error);
    process.exit(1);
  }
};

export default connectDB;
