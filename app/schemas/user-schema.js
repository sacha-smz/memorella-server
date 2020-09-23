const Joi = require("joi");

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirm: Joi.string().valid(Joi.ref("password")).required()
});

module.exports = schema;
