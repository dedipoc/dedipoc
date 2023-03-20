import mongoose from "mongoose";
import * as config from "../config";

// const { DATABASE_CONNECTIONSTRING } = process.env;

mongoose.set("strictQuery", false);

const connectDb = async () => {
  const connectionString = `mongodb://${config.databaseUsername}:${config.databasePassword}@${config.databaseCluster}:${config.databasePort}/${config.databaseName}?authMechanism=DEFAULT&authSource=${config.databaseAuth}`;
  console.debug("CONNECTION", connectionString);
  const m = await mongoose.connect(connectionString);
  return m.connection.getClient();
};

export default connectDb;
