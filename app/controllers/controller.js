const { PRIVATE_FIELDS } = require("../constants");

const controller = context => ({
  createOne: async (req, res, next) => {
    try {
      const entry = await context.datamapper.insertOne(req.body);
      res.status(201).json({ data: entry });
    } catch (err) {
      next(err);
    }
  },

  getDisplay: entry => {
    const privateFields = PRIVATE_FIELDS.get(context.name);

    if (privateFields) {
      for (const field of privateFields) {
        delete entry[field];
      }
    }
    return entry;
  }
});

module.exports = controller;
