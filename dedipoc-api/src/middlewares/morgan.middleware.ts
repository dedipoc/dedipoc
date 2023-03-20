import morgan from "morgan";
import logger from "../utils/logger";
import * as config from "../config";

const stream = {
  write: (message: string) => logger.http(message),
};

const skip = () => {
  const env = config.environment;
  return env !== "development";
};

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;
