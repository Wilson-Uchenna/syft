"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("./config/config");
const env = process.env.NODE_ENV || "development";
const config = config_1.config[env];
exports.sequelize = new sequelize_typescript_1.Sequelize({
    ...config.db, // spread the full config, including dialectOptions
    logging: false,
});
