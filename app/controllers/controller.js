const controller = domain => ({
  createOne: async (req, res, next) => {
    try {
      const insert = await domain.datamapper.insertOne(req.body);
      res.status(201).json({ data: insert });
    } catch (err) {
      next(err);
    }
  }
});

module.exports = controller;
