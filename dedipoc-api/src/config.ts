import { Options as RateOptions } from "express-rate-limit";
import { Options as ProxyOptions } from "http-proxy-middleware";

const {
  NODE_ENV,
  SERVICE_NAME,
  SERVER_PORT,
  SESSION_SECRET,
  STORE_SECRET,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_CLUSTER,
  DATABASE_NAME,
  DATABASE_AUTH,
} = process.env;

const environment: string = NODE_ENV || "development";
const serviceName: string = SERVICE_NAME || "test";
const serverPort: string = SERVER_PORT || "8080";
const sessionSecret: string = SESSION_SECRET || "jdsu7n35y";
const storeSecret: string = STORE_SECRET || "7zL7rKpIvQ";
const databaseCluster: string = DATABASE_CLUSTER || "";
const databaseName: string = DATABASE_NAME || "";
const databasePort: string = DATABASE_PORT || "";
const databaseAuth: string = DATABASE_AUTH || "";
const databaseUsername: string = encodeURIComponent(DATABASE_USERNAME || "");
const databasePassword: string = encodeURIComponent(DATABASE_PASSWORD || "");

const rate: Partial<RateOptions> = {
  windowMs: 10000,
  max: 5,
};

export {
  environment,
  serviceName,
  serverPort,
  sessionSecret,
  storeSecret,
  rate,
  databaseName,
  databasePassword,
  databasePort,
  databaseCluster,
  databaseUsername,
  databaseAuth,
};
