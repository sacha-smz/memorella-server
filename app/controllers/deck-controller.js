const path = require("path");
const fileUtils = require("../utils/file-utils");

const controller = require("./controller");
const deckDatamapper = require("../db/deck-datamapper");

const sup = controller({ datamapper: deckDatamapper });

const deckController = {
  createOne: async (req, res, next) => {
    [req.body.card_urls, res.errors] = await uploadFiles(req.files);
    return sup.createOne(req, res, next);
  },

  index: sup.index,

  showByPk: sup.showByPk,

  editByPk: async (req, res, next) => {
    [req.body.card_urls, res.errors] = await uploadFiles(req.files);
    return sup.editByPk(req, res, next);
  }
};

async function uploadFiles(files) {
  const urls = [];
  const errors = [];

  for (const file of files) {
    const tempPath = path.resolve(file.path);
    const subDir = file.filename.split("").slice(0, 4).join("/");
    const filename = file.filename.substring(4);

    const url = `cards/${subDir}/${filename}`;

    try {
      await fileUtils.upload(tempPath, file.mimetype, url);
      urls.push(url);
    } catch (err) {
      errors.push(err);
    }
  }

  return [urls, errors];
}

module.exports = deckController;
