"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = "development"; // Change to 'production' before deploying
exports.config = {
    development: {
        db: {
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT || 5432),
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        },
        app: {
            aws_bucket: process.env.AWS_BUCKET,
            aws_region: process.env.AWS_REGION,
            aws_profile: process.env.AWS_PROFILE,
            jwt_secret: process.env.JWT_SECRET || "default_secret",
            jwt_expiration: process.env.JWT_EXPIRATION || "1h",
        },
    },
    production: {
        db: {
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT || 5432),
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        },
        app: {
            aws_bucket: process.env.AWS_BUCKET,
            aws_region: process.env.AWS_REGION,
            aws_profile: process.env.AWS_PROFILE,
            jwt_secret: process.env.JWT_SECRET || "default_secret",
            jwt_expiration: process.env.JWT_EXPIRATION || "1h",
        },
    },
};
