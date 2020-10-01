const { PRIVATE_FIELDS } = require("../constants");

const controller = context => ({
  createOne: async (req, res, next) => {
    try {
      const entry = await context.datamapper.insertOne(req.body);
      res.status(201).json({ data: entry, errors: res.errors });
    } catch (err) {
      next(err);
    }
  },

  index: async (_, res, next) => {
    try {
      const entries = await context.datamapper.show();
      res.json({ data: entries });
    } catch (err) {
      next(err);
    }
  },

  showByPk: async (req, res, next) => {
    try {
      const { id } = req.params;
      const entry = await context.datamapper.showByPk(id);
      res.json({ data: entry });
    } catch (err) {
      next(err);
    }
  },

  editByPk: async (req, res, next) => {
    try {
      const { id } = req.params;
      const entry = await context.datamapper.updateByPk(id, req.body);
      res.json({ data: entry });
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
