import dotenv from "dotenv";
dotenv.config();

import { Options } from "sequelize";

type Env = "development" | "production";

interface AppConfig {
  aws_bucket: string;
  aws_region: string;
  aws_profile: string;
  jwt_secret: string;
  jwt_expiration: string;
}

interface FullConfig {
  [env: string]: {
    db: Options;
    app: AppConfig;
  };
}

export const env: Env = "development"; // Change to 'production' before deploying

export const config: FullConfig = {
  development: {
    db: {
      username: process.env.POSTGRES_USERNAME!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DB!,
      host: process.env.POSTGRES_HOST!,
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
      aws_bucket: process.env.AWS_BUCKET!,
      aws_region: process.env.AWS_REGION!,
      aws_profile: process.env.AWS_PROFILE!,
      jwt_secret: process.env.JWT_SECRET || "default_secret",
      jwt_expiration: process.env.JWT_EXPIRATION || "1h",
    },
  },
  production: {
    db: {
      username: process.env.POSTGRES_USERNAME!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DB!,
      host: process.env.POSTGRES_HOST!,
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
      aws_bucket: process.env.AWS_BUCKET!,
      aws_region: process.env.AWS_REGION!,
      aws_profile: process.env.AWS_PROFILE!,
      jwt_secret: process.env.JWT_SECRET || "default_secret",
      jwt_expiration: process.env.JWT_EXPIRATION || "1h",
    },
  },
};
