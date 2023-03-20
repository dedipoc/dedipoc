import cors from "cors";
import express from "express";
import * as config from "./config";
import connectDb from "./database/connection";
import helmetMiddleware from "./middlewares/helmet.middleware";
import morganMiddleware from "./middlewares/morgan.middleware";
import rateLimitMiddleware from "./middlewares/rateLimit.middleware";
import sessionMiddleware from "./middlewares/session.middleware";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import videoRoutes from "./routes/video";
import logger from "./utils/logger";

const app = express();

app.disable("x-powered-by");

app.use(express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ limit: "10mb" }));
app.use(morganMiddleware);
app.use(sessionMiddleware);
app.use(rateLimitMiddleware);
// app.use(corsMiddleware);
app.use(helmetMiddleware);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/video", videoRoutes);

app.listen(config.serverPort, () => {
  logger.info(`${config.serviceName} listening on port ${config.serverPort}`);
  connectDb()
    .then(() => {
      logger.info("Database connected");
    })
    .catch((err) => logger.error(err));
});
