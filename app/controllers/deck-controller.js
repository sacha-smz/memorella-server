const path = require("path");
const fileUtils = require("../utils/file-utils");

const controller = require("./controller");
const deckDatamapper = require("../db/deck-datamapper");

const sup = controller({ datamapper: deckDatamapper });

const deckController = {
  createOne: async (req, res, next) => {
    req.body.cardUrls = [];
    res.errors = [];

    for (const file of req.files) {
      const tempPath = path.resolve(file.path);
      const subDir = file.filename.split("").slice(0, 4).join("/");
      const filename = file.filename.substring(4);

      const url = `cards/${subDir}/${filename}`;

      try {
        await fileUtils.upload(tempPath, file.mimetype, url);
        req.body.cardUrls.push(url);
      } catch (err) {
        res.errors.push(err);
      }
    }

    return sup.createOne(req, res, next);
  },

  index: sup.index,

  showByPk: sup.showByPk
};

module.exports = deckController;
