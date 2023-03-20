import { Options, rateLimit } from "express-rate-limit";

const rateOptions: Partial<Options> = {
  windowMs: 1000,
  max: 100,
};

const rateLimitMiddleware = rateLimit(rateOptions);

export default rateLimitMiddleware;
