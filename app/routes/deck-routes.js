const express = require("express");

const validator = require("../middlewares/validator");

const deckSchema = require("../schemas/deck-schema");
const deckController = require("../controllers/deck-controller");

const deckRouter = express.Router();

deckRouter.get("/", deckController.index);
deckRouter.get(
  "/:id",
  validator(deckSchema, { context: { action: "show" } }),
  deckController.showByPk
);

module.exports = deckRouter;
