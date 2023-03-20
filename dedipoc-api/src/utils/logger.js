"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
var NODE_ENV = process.env.NODE_ENV;
var level = function () {
    var env = NODE_ENV || "development";
    var isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};
var colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
winston_1.default.addColors(colors);
var format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message); }));
var transports = [
    new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), format),
    }),
    new winston_1.default.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: format,
    }),
    new winston_1.default.transports.File({
        filename: "logs/all.log",
        format: format,
    }),
];
var logger = winston_1.default.createLogger({
    level: level(),
    levels: levels,
    transports: transports,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map