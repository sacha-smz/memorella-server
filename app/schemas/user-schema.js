const Joi = require("joi");

const schema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm: Joi.string()
      .valid(Joi.ref("password"))
      .when("$action", { is: "create", then: Joi.required() })
  }),
  params: Joi.optional(),
  query: Joi.optional()
});

module.exports = schema;
