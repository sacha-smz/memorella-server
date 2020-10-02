const Joi = require("joi");

const schema = Joi.object({
  body: Joi.object({
    name: Joi.when("$action", { is: Joi.valid("create", "edit"), then: Joi.string().required() }),
    removed_cards: Joi.when("$action", {
      is: "edit",
      then: Joi.array().items(Joi.number().positive())
    })
  }),
  params: Joi.object({
    id: Joi.when("$action", {
      is: Joi.valid("show", "edit"),
      then: Joi.number().positive().required()
    })
  }),
  query: Joi.optional()
});

module.exports = schema;
