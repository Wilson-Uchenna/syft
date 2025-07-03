import { Sequelize } from "sequelize-typescript";
import { config as dbConfig } from "./config/config";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env as keyof typeof dbConfig];

export const sequelize = new Sequelize({
  ...config.db, // spread the full config, including dialectOptions
  logging: false,
});
