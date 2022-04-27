import * as Joi from '@hapi/joi';

const Schema = Joi.object().keys({
  host: Joi.required(),
  port: Joi.number(),
});

export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: Schema.validateAsync({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  }),
});
