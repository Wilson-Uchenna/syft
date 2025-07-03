require('ts-node/register');
const config = require('./src/config/config.ts');

module.exports = {
  development: {
    ...config.config.development,
    dialect: 'postgres', // ✅ explicitly added here
  },
  production: {
    ...config.config.production,
    dialect: 'postgres',
  },
};
